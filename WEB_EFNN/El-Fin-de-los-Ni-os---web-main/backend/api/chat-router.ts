import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { chatMessages } from "@db/schema";
import { eq, desc } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const baseSystemPrompt = `Eres un asistente experto en analisis de datos hidricos para la provincia de Cordoba, Argentina. Tu proposito es ayudar a los usuarios a interpretar la informacion presentada en un panel de control. Los datos incluyen niveles de embalses, calidad del agua y pronosticos. Cuando el usuario pregunte, incorpora el conocimiento de que eres un asistente para este proyecto especifico, entiende el contexto de la conversacion y proporciona respuestas dinamicas y utiles. Se conciso y centrate en los datos del proyecto.`;

export const chatRouter = createRouter({
  sendMessage: publicQuery
    .input(
      z.object({
        sessionId: z.string(),
        message: z.string(),
        extendedKnowledge: z.boolean().optional(),
        creatorInstructions: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      // Store user message
      await db.insert(chatMessages).values({
        sessionId: input.sessionId,
        role: "user",
        content: input.message,
      });

      // Get chat history
      const history = await db
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.sessionId, input.sessionId))
        .orderBy(desc(chatMessages.createdAt))
        .limit(10);

      const chatHistory = history.reverse().map((msg) => ({
        role: msg.role as "user" | "model",
        parts: [{ text: msg.content }],
      }));

      let systemPrompt = baseSystemPrompt;
      if (input.extendedKnowledge) {
        systemPrompt += `\n\nMODO CONOCIMIENTO EXTENDIDO ACTIVADO: Ademas de tus capacidades actuales, ahora tienes acceso a un conocimiento general y experto. Puedes responder preguntas sobre hidrologia, ciencia ambiental, sistemas GIS (como QGIS), ingenieria civil relacionada con represas, cambio climatico y su impacto en los recursos hidricos, y politicas de gestion del agua a nivel global y nacional.`;
      }
      if (input.creatorInstructions) {
        systemPrompt += `\n\nInstruccion del Creador: ${input.creatorInstructions}`;
      }

      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // Prepend system prompt as first message in history
        const fullHistory = [
          { role: "user" as const, parts: [{ text: `[SYSTEM INSTRUCTION]: ${systemPrompt}\n\nAcknowledge and begin.` }] },
          { role: "model" as const, parts: [{ text: "Entendido. Estoy listo para ayudarte con el analisis de datos hidricos." }] },
          ...chatHistory,
        ];
        const chat = model.startChat({ history: fullHistory });

        const result = await chat.sendMessage(input.message);
        const response = result.response.text();

        // Store AI response
        await db.insert(chatMessages).values({
          sessionId: input.sessionId,
          role: "model",
          content: response,
        });

        return { response };
      } catch (error) {
        console.error("Gemini API error:", error);
        return {
          response: "Lo siento, ocurrio un error al procesar tu solicitud. Por favor, intenta de nuevo.",
        };
      }
    }),

  getHistory: publicQuery
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.sessionId, input.sessionId))
        .orderBy(chatMessages.createdAt);
    }),

  clearHistory: publicQuery
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(chatMessages).where(eq(chatMessages.sessionId, input.sessionId));
      return { success: true };
    }),
});
