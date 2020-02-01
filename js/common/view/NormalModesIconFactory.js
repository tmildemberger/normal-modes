// Copyright 2019, University of Colorado Boulder

/**
 * @author Franco Barpp Gomes (UTFPR)
 * @author Thiago de Mendonça Mildemberger (UTFPR)
 */
define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const normalModes = require( 'NORMAL_MODES/normalModes' );
  const Screen = require( 'JOIST/Screen' );
  const ScreenIcon = require( 'JOIST/ScreenIcon' );
  const Vector2 = require( 'DOT/Vector2' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Shape = require( 'KITE/Shape' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Circle = require( 'SCENERY/nodes/Circle' );
  
  // TODO - Fix 
  const NormalModesIconFactory = {
    
    createOneDimensionScreenIcon() {
      // dá de fazer o iconNode com node normal, usando os esquemas de model to view, pelo q eu vi la

      const rectSize = Screen.MINIMUM_HOME_SCREEN_ICON_SIZE;
      const iconNode = new Rectangle( 0, 0, rectSize.width, rectSize.height, {
        children: [ ]
      } );

      const mass = new Rectangle( {
        fill: '#007bff',
        stroke: Color.toColor( '#007bff' ).colorUtilsDarker( .6 ),
        boundsMethod: 'unstroked',
        lineWidth: 16,
        rectWidth: 80,
        rectHeight: 80,
      } );

      const springShape = new Shape().moveTo( 0, 0 ).lineTo( 0, 1 );
      
      const spring = new Path( springShape, {
        preventFit: true,
        boundsMethod: 'none',
        pickable: false,
        inputEnabled: false,
        stroke: 'red',
        lineWidth: 50
      } );

      spring.scale( 11, 15 );
      iconNode.addChild( spring );
      iconNode.addChild( mass );

      mass.center = iconNode.center;
      spring.translation = new Vector2( iconNode.centerX, iconNode.centerY - 15 );

      return new ScreenIcon( iconNode, {
        fill: Color.toColor( "#ffffff" ),
        maxIconWidthProportion: 1, /* isso n é o default, pode tirar se quiser */
        maxIconHeightProportion: 1,
      } );

    },

    createTwoDimensionsScreenIcon() {
      const rectSize = Screen.MINIMUM_HOME_SCREEN_ICON_SIZE;
      const iconNode = new Rectangle( 0, 0, rectSize.width, rectSize.height, {
        children: [ ]
      } );

      return new ScreenIcon( iconNode, {
        fill: Color.toColor( "#ffffff" ),
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1,
      } );
    }

  }

  return normalModes.register( 'NormalModesIconFactory', NormalModesIconFactory );
} );