<!DOCTYPE qgis PUBLIC 'http://mrcc.com/qgis.dtd' 'SYSTEM'>
<qgis simplifyMaxScale="1" version="3.18.3-Zürich" hasScaleBasedVisibilityFlag="0" simplifyDrawingTol="1" styleCategories="AllStyleCategories" simplifyLocal="1" minScale="100000000" maxScale="0" labelsEnabled="0" readOnly="0" simplifyDrawingHints="1" simplifyAlgorithm="0">
  <flags>
    <Identifiable>1</Identifiable>
    <Removable>1</Removable>
    <Searchable>1</Searchable>
    <Private>0</Private>
  </flags>
  <temporal durationUnit="min" mode="0" endExpression="" durationField="" endField="" fixedDuration="0" accumulate="0" enabled="0" startField="" startExpression="">
    <fixedRange>
      <start></start>
      <end></end>
    </fixedRange>
  </temporal>
  <renderer-v2 type="RuleRenderer" symbollevels="0" forceraster="0" enableorderby="0">
    <rules key="{6e88f4d8-684f-43d8-b508-da0927247e68}">
      <rule filter="estado = 'ALTA'" key="{cc46031a-127c-4120-9c7f-b7dda36f53d8}" symbol="0"/>
      <rule filter="estado = 'BAJA'" key="{aad98e13-ab72-4d46-bab6-f565c6462887}" symbol="1"/>
    </rules>
    <symbols>
      <symbol type="fill" clip_to_extent="1" force_rhr="0" name="0" alpha="1">
        <data_defined_properties>
          <Option type="Map">
            <Option value="" type="QString" name="name"/>
            <Option name="properties"/>
            <Option value="collection" type="QString" name="type"/>
          </Option>
        </data_defined_properties>
        <layer pass="0" enabled="1" class="SimpleFill" locked="0">
          <Option type="Map">
            <Option value="3x:0,0,0,0,0,0" type="QString" name="border_width_map_unit_scale"/>
            <Option value="35,206,35,40" type="QString" name="color"/>
            <Option value="bevel" type="QString" name="joinstyle"/>
            <Option value="0,0" type="QString" name="offset"/>
            <Option value="3x:0,0,0,0,0,0" type="QString" name="offset_map_unit_scale"/>
            <Option value="Pixel" type="QString" name="offset_unit"/>
            <Option value="35,206,35,255" type="QString" name="outline_color"/>
            <Option value="solid" type="QString" name="outline_style"/>
            <Option value="2.3" type="QString" name="outline_width"/>
            <Option value="Pixel" type="QString" name="outline_width_unit"/>
            <Option value="solid" type="QString" name="style"/>
          </Option>
          <prop v="3x:0,0,0,0,0,0" k="border_width_map_unit_scale"/>
          <prop v="35,206,35,40" k="color"/>
          <prop v="bevel" k="joinstyle"/>
          <prop v="0,0" k="offset"/>
          <prop v="3x:0,0,0,0,0,0" k="offset_map_unit_scale"/>
          <prop v="Pixel" k="offset_unit"/>
          <prop v="35,206,35,255" k="outline_color"/>
          <prop v="solid" k="outline_style"/>
          <prop v="2.3" k="outline_width"/>
          <prop v="Pixel" k="outline_width_unit"/>
          <prop v="solid" k="style"/>
          <data_defined_properties>
            <Option type="Map">
              <Option value="" type="QString" name="name"/>
              <Option name="properties"/>
              <Option value="collection" type="QString" name="type"/>
            </Option>
          </data_defined_properties>
        </layer>
      </symbol>
      <symbol type="fill" clip_to_extent="1" force_rhr="0" name="1" alpha="1">
        <data_defined_properties>
          <Option type="Map">
            <Option value="" type="QString" name="name"/>
            <Option name="properties"/>
            <Option value="collection" type="QString" name="type"/>
          </Option>
        </data_defined_properties>
        <layer pass="0" enabled="1" class="SimpleFill" locked="0">
          <Option type="Map">
            <Option value="3x:0,0,0,0,0,0" type="QString" name="border_width_map_unit_scale"/>
            <Option value="0,0,0,0" type="QString" name="color"/>
            <Option value="bevel" type="QString" name="joinstyle"/>
            <Option value="0,0" type="QString" name="offset"/>
            <Option value="3x:0,0,0,0,0,0" type="QString" name="offset_map_unit_scale"/>
            <Option value="Pixel" type="QString" name="offset_unit"/>
            <Option value="0,0,0,0" type="QString" name="outline_color"/>
            <Option value="solid" type="QString" name="outline_style"/>
            <Option value="1.5" type="QString" name="outline_width"/>
            <Option value="Pixel" type="QString" name="outline_width_unit"/>
            <Option value="solid" type="QString" name="style"/>
          </Option>
          <prop v="3x:0,0,0,0,0,0" k="border_width_map_unit_scale"/>
          <prop v="0,0,0,0" k="color"/>
          <prop v="bevel" k="joinstyle"/>
          <prop v="0,0" k="offset"/>
          <prop v="3x:0,0,0,0,0,0" k="offset_map_unit_scale"/>
          <prop v="Pixel" k="offset_unit"/>
          <prop v="0,0,0,0" k="outline_color"/>
          <prop v="solid" k="outline_style"/>
          <prop v="1.5" k="outline_width"/>
          <prop v="Pixel" k="outline_width_unit"/>
          <prop v="solid" k="style"/>
          <data_defined_properties>
            <Option type="Map">
              <Option value="" type="QString" name="name"/>
              <Option name="properties"/>
              <Option value="collection" type="QString" name="type"/>
            </Option>
          </data_defined_properties>
        </layer>
      </symbol>
    </symbols>
  </renderer-v2>
  <customproperties>
    <property value="0" key="embeddedWidgets/count"/>
    <property key="variableNames"/>
    <property key="variableValues"/>
  </customproperties>
  <blendMode>0</blendMode>
  <featureBlendMode>0</featureBlendMode>
  <layerOpacity>1</layerOpacity>
  <SingleCategoryDiagramRenderer diagramType="Histogram" attributeLegend="1">
    <DiagramCategory backgroundAlpha="255" labelPlacementMethod="XHeight" rotationOffset="270" spacing="5" minScaleDenominator="0" barWidth="5" sizeScale="3x:0,0,0,0,0,0" penWidth="0" height="15" penColor="#000000" spacingUnit="MM" backgroundColor="#ffffff" diagramOrientation="Up" scaleBasedVisibility="0" enabled="0" width="15" scaleDependency="Area" penAlpha="255" maxScaleDenominator="1e+08" showAxis="1" minimumSize="0" lineSizeType="MM" lineSizeScale="3x:0,0,0,0,0,0" sizeType="MM" direction="0" spacingUnitScale="3x:0,0,0,0,0,0" opacity="1">
      <fontProperties style="" description="MS Shell Dlg 2,6.5,-1,5,50,0,0,0,0,0"/>
      <axisSymbol>
        <symbol type="line" clip_to_extent="1" force_rhr="0" name="" alpha="1">
          <data_defined_properties>
            <Option type="Map">
              <Option value="" type="QString" name="name"/>
              <Option name="properties"/>
              <Option value="collection" type="QString" name="type"/>
            </Option>
          </data_defined_properties>
          <layer pass="0" enabled="1" class="SimpleLine" locked="0">
            <Option type="Map">
              <Option value="0" type="QString" name="align_dash_pattern"/>
              <Option value="square" type="QString" name="capstyle"/>
              <Option value="5;2" type="QString" name="customdash"/>
              <Option value="3x:0,0,0,0,0,0" type="QString" name="customdash_map_unit_scale"/>
              <Option value="MM" type="QString" name="customdash_unit"/>
              <Option value="0" type="QString" name="dash_pattern_offset"/>
              <Option value="3x:0,0,0,0,0,0" type="QString" name="dash_pattern_offset_map_unit_scale"/>
              <Option value="MM" type="QString" name="dash_pattern_offset_unit"/>
              <Option value="0" type="QString" name="draw_inside_polygon"/>
              <Option value="bevel" type="QString" name="joinstyle"/>
              <Option value="35,35,35,255" type="QString" name="line_color"/>
              <Option value="solid" type="QString" name="line_style"/>
              <Option value="0.26" type="QString" name="line_width"/>
              <Option value="MM" type="QString" name="line_width_unit"/>
              <Option value="0" type="QString" name="offset"/>
              <Option value="3x:0,0,0,0,0,0" type="QString" name="offset_map_unit_scale"/>
              <Option value="MM" type="QString" name="offset_unit"/>
              <Option value="0" type="QString" name="ring_filter"/>
              <Option value="0" type="QString" name="tweak_dash_pattern_on_corners"/>
              <Option value="0" type="QString" name="use_custom_dash"/>
              <Option value="3x:0,0,0,0,0,0" type="QString" name="width_map_unit_scale"/>
            </Option>
            <prop v="0" k="align_dash_pattern"/>
            <prop v="square" k="capstyle"/>
            <prop v="5;2" k="customdash"/>
            <prop v="3x:0,0,0,0,0,0" k="customdash_map_unit_scale"/>
            <prop v="MM" k="customdash_unit"/>
            <prop v="0" k="dash_pattern_offset"/>
            <prop v="3x:0,0,0,0,0,0" k="dash_pattern_offset_map_unit_scale"/>
            <prop v="MM" k="dash_pattern_offset_unit"/>
            <prop v="0" k="draw_inside_polygon"/>
            <prop v="bevel" k="joinstyle"/>
            <prop v="35,35,35,255" k="line_color"/>
            <prop v="solid" k="line_style"/>
            <prop v="0.26" k="line_width"/>
            <prop v="MM" k="line_width_unit"/>
            <prop v="0" k="offset"/>
            <prop v="3x:0,0,0,0,0,0" k="offset_map_unit_scale"/>
            <prop v="MM" k="offset_unit"/>
            <prop v="0" k="ring_filter"/>
            <prop v="0" k="tweak_dash_pattern_on_corners"/>
            <prop v="0" k="use_custom_dash"/>
            <prop v="3x:0,0,0,0,0,0" k="width_map_unit_scale"/>
            <data_defined_properties>
              <Option type="Map">
                <Option value="" type="QString" name="name"/>
                <Option name="properties"/>
                <Option value="collection" type="QString" name="type"/>
              </Option>
            </data_defined_properties>
          </layer>
        </symbol>
      </axisSymbol>
    </DiagramCategory>
  </SingleCategoryDiagramRenderer>
  <DiagramLayerSettings priority="0" zIndex="0" placement="1" obstacle="0" dist="0" linePlacementFlags="18" showAll="1">
    <properties>
      <Option type="Map">
        <Option value="" type="QString" name="name"/>
        <Option name="properties"/>
        <Option value="collection" type="QString" name="type"/>
      </Option>
    </properties>
  </DiagramLayerSettings>
  <geometryOptions removeDuplicateNodes="0" geometryPrecision="0">
    <activeChecks/>
    <checkConfiguration type="Map">
      <Option type="Map" name="QgsGeometryGapCheck">
        <Option value="0" type="double" name="allowedGapsBuffer"/>
        <Option value="false" type="bool" name="allowedGapsEnabled"/>
        <Option value="" type="QString" name="allowedGapsLayer"/>
      </Option>
    </checkConfiguration>
  </geometryOptions>
  <legend type="default-vector"/>
  <referencedLayers/>
  <fieldConfiguration>
    <field configurationFlags="None" name="expediente">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field configurationFlags="None" name="anio">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field configurationFlags="None" name="padron_registro">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field configurationFlags="None" name="nombre">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field configurationFlags="None" name="minerales">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field configurationFlags="None" name="estado">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field configurationFlags="None" name="departamento">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field configurationFlags="None" name="pedania">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field configurationFlags="None" name="concesionario">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field configurationFlags="None" name="propietario_suelo">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field configurationFlags="None" name="fecha_ubicacion">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field configurationFlags="None" name="mensura">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field configurationFlags="None" name="perito">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field configurationFlags="None" name="fecha_mensura">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field configurationFlags="None" name="pertenencias_mensuradas">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field configurationFlags="None" name="fecha_aprobacion_mensura">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field configurationFlags="None" name="x_posgar">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field configurationFlags="None" name="y_posgar">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field configurationFlags="None" name="lat_wgs_84">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field configurationFlags="None" name="long_wgs_84">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field configurationFlags="None" name="fecha_baja">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field configurationFlags="None" name="servidumbre_paso">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field configurationFlags="None" name="impacto_ambiental">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field configurationFlags="None" name="ruami">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field configurationFlags="None" name="razon_social_apellido_nombre">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field configurationFlags="None" name="resolucion">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field configurationFlags="None" name="observacion">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field configurationFlags="None" name="vencimiento">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field configurationFlags="None" name="fid">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
  </fieldConfiguration>
  <aliases>
    <alias field="expediente" index="0" name=""/>
    <alias field="anio" index="1" name=""/>
    <alias field="padron_registro" index="2" name=""/>
    <alias field="nombre" index="3" name=""/>
    <alias field="minerales" index="4" name=""/>
    <alias field="estado" index="5" name=""/>
    <alias field="departamento" index="6" name=""/>
    <alias field="pedania" index="7" name=""/>
    <alias field="concesionario" index="8" name=""/>
    <alias field="propietario_suelo" index="9" name=""/>
    <alias field="fecha_ubicacion" index="10" name=""/>
    <alias field="mensura" index="11" name=""/>
    <alias field="perito" index="12" name=""/>
    <alias field="fecha_mensura" index="13" name=""/>
    <alias field="pertenencias_mensuradas" index="14" name=""/>
    <alias field="fecha_aprobacion_mensura" index="15" name=""/>
    <alias field="x_posgar" index="16" name=""/>
    <alias field="y_posgar" index="17" name=""/>
    <alias field="lat_wgs_84" index="18" name=""/>
    <alias field="long_wgs_84" index="19" name=""/>
    <alias field="fecha_baja" index="20" name=""/>
    <alias field="servidumbre_paso" index="21" name=""/>
    <alias field="impacto_ambiental" index="22" name=""/>
    <alias field="ruami" index="23" name=""/>
    <alias field="razon_social_apellido_nombre" index="24" name=""/>
    <alias field="resolucion" index="25" name=""/>
    <alias field="observacion" index="26" name=""/>
    <alias field="vencimiento" index="27" name=""/>
    <alias field="fid" index="28" name=""/>
  </aliases>
  <defaults>
    <default field="expediente" expression="" applyOnUpdate="0"/>
    <default field="anio" expression="" applyOnUpdate="0"/>
    <default field="padron_registro" expression="" applyOnUpdate="0"/>
    <default field="nombre" expression="" applyOnUpdate="0"/>
    <default field="minerales" expression="" applyOnUpdate="0"/>
    <default field="estado" expression="" applyOnUpdate="0"/>
    <default field="departamento" expression="" applyOnUpdate="0"/>
    <default field="pedania" expression="" applyOnUpdate="0"/>
    <default field="concesionario" expression="" applyOnUpdate="0"/>
    <default field="propietario_suelo" expression="" applyOnUpdate="0"/>
    <default field="fecha_ubicacion" expression="" applyOnUpdate="0"/>
    <default field="mensura" expression="" applyOnUpdate="0"/>
    <default field="perito" expression="" applyOnUpdate="0"/>
    <default field="fecha_mensura" expression="" applyOnUpdate="0"/>
    <default field="pertenencias_mensuradas" expression="" applyOnUpdate="0"/>
    <default field="fecha_aprobacion_mensura" expression="" applyOnUpdate="0"/>
    <default field="x_posgar" expression="" applyOnUpdate="0"/>
    <default field="y_posgar" expression="" applyOnUpdate="0"/>
    <default field="lat_wgs_84" expression="" applyOnUpdate="0"/>
    <default field="long_wgs_84" expression="" applyOnUpdate="0"/>
    <default field="fecha_baja" expression="" applyOnUpdate="0"/>
    <default field="servidumbre_paso" expression="" applyOnUpdate="0"/>
    <default field="impacto_ambiental" expression="" applyOnUpdate="0"/>
    <default field="ruami" expression="" applyOnUpdate="0"/>
    <default field="razon_social_apellido_nombre" expression="" applyOnUpdate="0"/>
    <default field="resolucion" expression="" applyOnUpdate="0"/>
    <default field="observacion" expression="" applyOnUpdate="0"/>
    <default field="vencimiento" expression="" applyOnUpdate="0"/>
    <default field="fid" expression="" applyOnUpdate="0"/>
  </defaults>
  <constraints>
    <constraint field="expediente" exp_strength="0" unique_strength="0" notnull_strength="0" constraints="0"/>
    <constraint field="anio" exp_strength="0" unique_strength="0" notnull_strength="0" constraints="0"/>
    <constraint field="padron_registro" exp_strength="0" unique_strength="0" notnull_strength="0" constraints="0"/>
    <constraint field="nombre" exp_strength="0" unique_strength="0" notnull_strength="0" constraints="0"/>
    <constraint field="minerales" exp_strength="0" unique_strength="0" notnull_strength="0" constraints="0"/>
    <constraint field="estado" exp_strength="0" unique_strength="0" notnull_strength="0" constraints="0"/>
    <constraint field="departamento" exp_strength="0" unique_strength="0" notnull_strength="0" constraints="0"/>
    <constraint field="pedania" exp_strength="0" unique_strength="0" notnull_strength="0" constraints="0"/>
    <constraint field="concesionario" exp_strength="0" unique_strength="0" notnull_strength="0" constraints="0"/>
    <constraint field="propietario_suelo" exp_strength="0" unique_strength="0" notnull_strength="0" constraints="0"/>
    <constraint field="fecha_ubicacion" exp_strength="0" unique_strength="0" notnull_strength="0" constraints="0"/>
    <constraint field="mensura" exp_strength="0" unique_strength="0" notnull_strength="0" constraints="0"/>
    <constraint field="perito" exp_strength="0" unique_strength="0" notnull_strength="0" constraints="0"/>
    <constraint field="fecha_mensura" exp_strength="0" unique_strength="0" notnull_strength="0" constraints="0"/>
    <constraint field="pertenencias_mensuradas" exp_strength="0" unique_strength="0" notnull_strength="0" constraints="0"/>
    <constraint field="fecha_aprobacion_mensura" exp_strength="0" unique_strength="0" notnull_strength="0" constraints="0"/>
    <constraint field="x_posgar" exp_strength="0" unique_strength="0" notnull_strength="0" constraints="0"/>
    <constraint field="y_posgar" exp_strength="0" unique_strength="0" notnull_strength="0" constraints="0"/>
    <constraint field="lat_wgs_84" exp_strength="0" unique_strength="0" notnull_strength="0" constraints="0"/>
    <constraint field="long_wgs_84" exp_strength="0" unique_strength="0" notnull_strength="0" constraints="0"/>
    <constraint field="fecha_baja" exp_strength="0" unique_strength="0" notnull_strength="0" constraints="0"/>
    <constraint field="servidumbre_paso" exp_strength="0" unique_strength="0" notnull_strength="0" constraints="0"/>
    <constraint field="impacto_ambiental" exp_strength="0" unique_strength="0" notnull_strength="0" constraints="0"/>
    <constraint field="ruami" exp_strength="0" unique_strength="0" notnull_strength="0" constraints="0"/>
    <constraint field="razon_social_apellido_nombre" exp_strength="0" unique_strength="0" notnull_strength="0" constraints="0"/>
    <constraint field="resolucion" exp_strength="0" unique_strength="0" notnull_strength="0" constraints="0"/>
    <constraint field="observacion" exp_strength="0" unique_strength="0" notnull_strength="0" constraints="0"/>
    <constraint field="vencimiento" exp_strength="0" unique_strength="0" notnull_strength="0" constraints="0"/>
    <constraint field="fid" exp_strength="0" unique_strength="1" notnull_strength="1" constraints="3"/>
  </constraints>
  <constraintExpressions>
    <constraint field="expediente" exp="" desc=""/>
    <constraint field="anio" exp="" desc=""/>
    <constraint field="padron_registro" exp="" desc=""/>
    <constraint field="nombre" exp="" desc=""/>
    <constraint field="minerales" exp="" desc=""/>
    <constraint field="estado" exp="" desc=""/>
    <constraint field="departamento" exp="" desc=""/>
    <constraint field="pedania" exp="" desc=""/>
    <constraint field="concesionario" exp="" desc=""/>
    <constraint field="propietario_suelo" exp="" desc=""/>
    <constraint field="fecha_ubicacion" exp="" desc=""/>
    <constraint field="mensura" exp="" desc=""/>
    <constraint field="perito" exp="" desc=""/>
    <constraint field="fecha_mensura" exp="" desc=""/>
    <constraint field="pertenencias_mensuradas" exp="" desc=""/>
    <constraint field="fecha_aprobacion_mensura" exp="" desc=""/>
    <constraint field="x_posgar" exp="" desc=""/>
    <constraint field="y_posgar" exp="" desc=""/>
    <constraint field="lat_wgs_84" exp="" desc=""/>
    <constraint field="long_wgs_84" exp="" desc=""/>
    <constraint field="fecha_baja" exp="" desc=""/>
    <constraint field="servidumbre_paso" exp="" desc=""/>
    <constraint field="impacto_ambiental" exp="" desc=""/>
    <constraint field="ruami" exp="" desc=""/>
    <constraint field="razon_social_apellido_nombre" exp="" desc=""/>
    <constraint field="resolucion" exp="" desc=""/>
    <constraint field="observacion" exp="" desc=""/>
    <constraint field="vencimiento" exp="" desc=""/>
    <constraint field="fid" exp="" desc=""/>
  </constraintExpressions>
  <expressionfields/>
  <attributeactions>
    <defaultAction value="{00000000-0000-0000-0000-000000000000}" key="Canvas"/>
  </attributeactions>
  <attributetableconfig sortOrder="0" sortExpression="" actionWidgetStyle="dropDown">
    <columns>
      <column type="field" hidden="0" width="-1" name="expediente"/>
      <column type="field" hidden="0" width="-1" name="anio"/>
      <column type="field" hidden="0" width="-1" name="padron_registro"/>
      <column type="field" hidden="0" width="-1" name="nombre"/>
      <column type="field" hidden="0" width="-1" name="minerales"/>
      <column type="field" hidden="0" width="-1" name="estado"/>
      <column type="field" hidden="0" width="-1" name="departamento"/>
      <column type="field" hidden="0" width="-1" name="pedania"/>
      <column type="field" hidden="0" width="-1" name="concesionario"/>
      <column type="field" hidden="0" width="-1" name="propietario_suelo"/>
      <column type="field" hidden="0" width="-1" name="fecha_ubicacion"/>
      <column type="field" hidden="0" width="-1" name="mensura"/>
      <column type="field" hidden="0" width="-1" name="perito"/>
      <column type="field" hidden="0" width="-1" name="fecha_mensura"/>
      <column type="field" hidden="0" width="-1" name="pertenencias_mensuradas"/>
      <column type="field" hidden="0" width="-1" name="fecha_aprobacion_mensura"/>
      <column type="field" hidden="0" width="-1" name="x_posgar"/>
      <column type="field" hidden="0" width="-1" name="y_posgar"/>
      <column type="field" hidden="0" width="-1" name="lat_wgs_84"/>
      <column type="field" hidden="0" width="-1" name="long_wgs_84"/>
      <column type="field" hidden="0" width="-1" name="fecha_baja"/>
      <column type="field" hidden="0" width="-1" name="servidumbre_paso"/>
      <column type="field" hidden="0" width="-1" name="impacto_ambiental"/>
      <column type="field" hidden="0" width="-1" name="ruami"/>
      <column type="field" hidden="0" width="-1" name="razon_social_apellido_nombre"/>
      <column type="field" hidden="0" width="-1" name="resolucion"/>
      <column type="field" hidden="0" width="-1" name="observacion"/>
      <column type="field" hidden="0" width="-1" name="vencimiento"/>
      <column type="field" hidden="0" width="-1" name="fid"/>
      <column type="actions" hidden="1" width="-1"/>
    </columns>
  </attributetableconfig>
  <conditionalstyles>
    <rowstyles/>
    <fieldstyles/>
  </conditionalstyles>
  <storedexpressions/>
  <editform tolerant="1"></editform>
  <editforminit/>
  <editforminitcodesource>0</editforminitcodesource>
  <editforminitfilepath></editforminitfilepath>
  <editforminitcode><![CDATA[# -*- codificación: utf-8 -*-
"""
Los formularios de QGIS pueden tener una función de Python que
es llamada cuando se abre el formulario.

Use esta función para añadir lógica extra a sus formularios.

Introduzca el nombre de la función en el campo
"Python Init function".
Sigue un ejemplo:
"""
from qgis.PyQt.QtWidgets import QWidget

def my_form_open(dialog, layer, feature):
	geom = feature.geometry()
	control = dialog.findChild(QWidget, "MyLineEdit")
]]></editforminitcode>
  <featformsuppress>0</featformsuppress>
  <editorlayout>generatedlayout</editorlayout>
  <editable>
    <field editable="1" name="anio"/>
    <field editable="1" name="concesionario"/>
    <field editable="1" name="departamento"/>
    <field editable="1" name="estado"/>
    <field editable="1" name="expediente"/>
    <field editable="1" name="fecha_aprobacion_mensura"/>
    <field editable="1" name="fecha_baja"/>
    <field editable="1" name="fecha_mensura"/>
    <field editable="1" name="fecha_ubicacion"/>
    <field editable="1" name="fid"/>
    <field editable="1" name="impacto_ambiental"/>
    <field editable="1" name="lat_wgs_84"/>
    <field editable="1" name="long_wgs_84"/>
    <field editable="1" name="mensura"/>
    <field editable="1" name="minerales"/>
    <field editable="1" name="nombre"/>
    <field editable="1" name="observacion"/>
    <field editable="1" name="padron_registro"/>
    <field editable="1" name="pedania"/>
    <field editable="1" name="perito"/>
    <field editable="1" name="pertenencias_mensuradas"/>
    <field editable="1" name="propietario_suelo"/>
    <field editable="1" name="razon_social_apellido_nombre"/>
    <field editable="1" name="resolucion"/>
    <field editable="1" name="ruami"/>
    <field editable="1" name="servidumbre_paso"/>
    <field editable="1" name="vencimiento"/>
    <field editable="1" name="x_posgar"/>
    <field editable="1" name="y_posgar"/>
  </editable>
  <labelOnTop>
    <field labelOnTop="0" name="anio"/>
    <field labelOnTop="0" name="concesionario"/>
    <field labelOnTop="0" name="departamento"/>
    <field labelOnTop="0" name="estado"/>
    <field labelOnTop="0" name="expediente"/>
    <field labelOnTop="0" name="fecha_aprobacion_mensura"/>
    <field labelOnTop="0" name="fecha_baja"/>
    <field labelOnTop="0" name="fecha_mensura"/>
    <field labelOnTop="0" name="fecha_ubicacion"/>
    <field labelOnTop="0" name="fid"/>
    <field labelOnTop="0" name="impacto_ambiental"/>
    <field labelOnTop="0" name="lat_wgs_84"/>
    <field labelOnTop="0" name="long_wgs_84"/>
    <field labelOnTop="0" name="mensura"/>
    <field labelOnTop="0" name="minerales"/>
    <field labelOnTop="0" name="nombre"/>
    <field labelOnTop="0" name="observacion"/>
    <field labelOnTop="0" name="padron_registro"/>
    <field labelOnTop="0" name="pedania"/>
    <field labelOnTop="0" name="perito"/>
    <field labelOnTop="0" name="pertenencias_mensuradas"/>
    <field labelOnTop="0" name="propietario_suelo"/>
    <field labelOnTop="0" name="razon_social_apellido_nombre"/>
    <field labelOnTop="0" name="resolucion"/>
    <field labelOnTop="0" name="ruami"/>
    <field labelOnTop="0" name="servidumbre_paso"/>
    <field labelOnTop="0" name="vencimiento"/>
    <field labelOnTop="0" name="x_posgar"/>
    <field labelOnTop="0" name="y_posgar"/>
  </labelOnTop>
  <dataDefinedFieldProperties/>
  <widgets/>
  <previewExpression>"nombre"</previewExpression>
  <mapTip></mapTip>
  <layerGeometryType>2</layerGeometryType>
</qgis>
