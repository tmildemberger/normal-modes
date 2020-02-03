// Copyright 2019-2020, University of Colorado Boulder

/**
 * AccordionBox containing amplitude and phase selection for the normal modes.
 *
 * @author Franco Barpp Gomes (UTFPR)
 * @author Thiago de Mendonça Mildemberger (UTFPR)
 */
define( require => {
    'use strict';
  
    // modules
    const AccordionBox = require( 'SUN/AccordionBox' );
    const AmpSelectorRectNode = require( 'NORMAL_MODES/two-dimensions/view/AmpSelectorRectNode' );
    const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
    const Color = require( 'SCENERY/util/Color' );
    const DerivedProperty = require( 'AXON/DerivedProperty' );
    const FireListener = require( 'SCENERY/listeners/FireListener' );
    const HBox = require( 'SCENERY/nodes/HBox' );
    const HStrut = require( 'SCENERY/nodes/HStrut' );
    const merge = require( 'PHET_CORE/merge' );
    const normalModes = require( 'NORMAL_MODES/normalModes' );
    const NormalModesConstants = require( 'NORMAL_MODES/common/NormalModesConstants' );
    const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
    const Rectangle = require( 'SCENERY/nodes/Rectangle' );    
    const Text = require( 'SCENERY/nodes/Text' );
    const TwoDimensionsConstants = require( 'NORMAL_MODES/two-dimensions/TwoDimensionsConstants' );
    const Vector2 = require( 'DOT/Vector2' );
    
    // strings
    const normalModeAmplitudesString = require( 'string!NORMAL_MODES/amp-selector-2d.normal-mode-amplitudes' );

    const PANEL_SIZE = 270;
    const RECT_GRID_UNITS = 5;
    const PADDING_GRID_UNITS = 1;

    class AmpSelectorAccordionBox extends AccordionBox {
  
      /**
       * @param {Object} [options]
       * @param {Model} model
       */
      constructor( options, model ) {
  
        /*
        Model properties used:
          - ampSelectorAxisProperty
          - modeXAmplitudeProperty
          - modeYAmplitudeProperty
        */

        // from Vector Addition
        const PANEL_CORNER_RADIUS = 5;
        const PANEL_X_MARGIN = 9;
        const PANEL_Y_MARGIN = 10;

        options = merge( options, {
          resize: true,

          cornerRadius: PANEL_CORNER_RADIUS,
          contentXMargin: - 24 - 2 * PANEL_X_MARGIN,
          contentYMargin: PANEL_Y_MARGIN,
          contentXSpacing: PANEL_X_MARGIN,
          contentYSpacing: 1,
          buttonXMargin: PANEL_X_MARGIN,
          buttonYMargin: PANEL_Y_MARGIN,
          titleYMargin: PANEL_Y_MARGIN,
          titleXMargin: PANEL_X_MARGIN,
          titleXSpacing: PANEL_X_MARGIN,
          titleAlignX: 'left',
          expandCollapseButtonOptions: {
            sideLength: 22,
            touchAreaXDilation: 6,
            touchAreaYDilation: 6
          },

          titleNode: new Text( normalModeAmplitudesString, { font: NormalModesConstants.CONTROL_FONT } ),
          showTitleWhenExpanded: false

        } );

        const RADIO_BUTTON_ICON_SIZE = 45;
        const iconSize = RADIO_BUTTON_ICON_SIZE;
        const AXES_ARROW_OPTIONS = {
          doubleHead: true,
          tailWidth: 1.5,
          headWidth: 10,
          headHeight: 10,
          fill: 'black',
          stroke: null,
          maxWidth: iconSize,
          maxHeight: iconSize
        };
        
        const horizontalButton = new ArrowNode( 0, 0, iconSize, 0, AXES_ARROW_OPTIONS );
        const verticalButton = new ArrowNode( 0, 0, 0, iconSize, AXES_ARROW_OPTIONS );
        const ampSelectorAxisRadioButtonGroup = new RadioButtonGroup( model.ampSelectorAxisProperty, [ {
          value: model.ampSelectorAxis.HORIZONTAL,
          node: horizontalButton
        }, {
          value: model.ampSelectorAxis.VERTICAL,
          node: verticalButton
        } ], {
          deselectedLineWidth: 1,
          selectedLineWidth: 1.5,
          cornerRadius: 8,
          deselectedButtonOpacity: 0.35,
          buttonContentXMargin: 8,
          buttonContentYMargin: 8,
          orientation: 'vertical'
        } );

        const ampAxisProperty = new DerivedProperty( [ model.ampSelectorAxisProperty ], ( selectorAxis ) => {
          return ( selectorAxis === model.ampSelectorAxis.VERTICAL ) ? model.modeYAmplitudeProperty : model.modeXAmplitudeProperty;
        } );

        const maxAmpProperty = new DerivedProperty( [ model.numVisibleMassesProperty ], ( numMasses ) => {
          return TwoDimensionsConstants.MAX_MODE_AMPLITUDE[ numMasses - 1 ];
        } );

        const gridSizeProperty = new DerivedProperty( [ model.numVisibleMassesProperty ], ( numMasses ) => {
          return PANEL_SIZE / ( 1 + ( RECT_GRID_UNITS + PADDING_GRID_UNITS ) * numMasses );
        } );

        const selectorRectsLength = NormalModesConstants.MAX_MASSES_ROW_LEN ** 2;
        const selectorRects = new Array( selectorRectsLength );

        for ( let i = 0; i < selectorRectsLength; i++ ) {
          const row = Math.trunc( i / NormalModesConstants.MAX_MASSES_ROW_LEN );
          const col = i % NormalModesConstants.MAX_MASSES_ROW_LEN;

          selectorRects[ i ] = new AmpSelectorRectNode( {
            rectGridSize: RECT_GRID_UNITS,
            paddingGridSize: PADDING_GRID_UNITS,
          }, model, row, col, ampAxisProperty, maxAmpProperty, gridSizeProperty );
        }
        
        const selectorBox = new Rectangle( { 
          children: selectorRects,
          rectHeight: PANEL_SIZE,
          rectWidth: PANEL_SIZE
        } );

        const rightMargin = new HStrut( 15 + PANEL_X_MARGIN );
        const leftMargin = new HStrut( PANEL_X_MARGIN );

        const contentNode = new HBox( {
          spacing: 0,
          align: 'center',
          children: [ ampSelectorAxisRadioButtonGroup, leftMargin, selectorBox, rightMargin ]
        } );
        
        super( contentNode, options );

      }
  
      /**
       * @public
       */
      reset() {
        
      }
  
    }
    return normalModes.register( 'AmpSelectorAccordionBox', AmpSelectorAccordionBox );
  } );