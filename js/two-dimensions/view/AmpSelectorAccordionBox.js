// Copyright 2019, University of Colorado Boulder

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
    const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
    const Color = require( 'SCENERY/util/Color' );
    const Dimension2 = require( 'DOT/Dimension2' );
    const HBox = require( 'SCENERY/nodes/HBox' );
    const HStrut = require( 'SCENERY/nodes/HStrut' );
    const Line = require( 'SCENERY/nodes/Line' );
    const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
    const merge = require( 'PHET_CORE/merge' );
    const Node = require( 'SCENERY/nodes/Node' );
    const NumberControl = require( 'SCENERY_PHET/NumberControl' );
    const normalModes = require( 'NORMAL_MODES/normalModes' );
    const NormalModesConstants = require( 'NORMAL_MODES/common/NormalModesConstants' );
    const Panel = require( 'SUN/Panel' );
    const Property = require( 'AXON/Property' );
    const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
    const RangeWithValue = require( 'DOT/RangeWithValue' );
    const Text = require( 'SCENERY/nodes/Text' );
    const TwoDimensionsConstants = require( 'NORMAL_MODES/two-dimensions/TwoDimensionsConstants' );
    const VBox = require( 'SCENERY/nodes/VBox' );
    const VStrut = require( 'SCENERY/nodes/VStrut' );
    const Vector2 = require( 'DOT/Vector2' );
    const Rectangle = require( 'SCENERY/nodes/Rectangle' );    
    
    // strings
    const normalModeAmplitudesString = require( 'string!NORMAL_MODES/amp-selector-2d.normal-mode-amplitudes' );

    class AmpPhaseAccordionBox extends AccordionBox {
  
      /**
       * @param {Object} [options]
       * @param {Model} model
       */
      constructor( options, modelViewTransform, model ) {
  
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
          contentXMargin: PANEL_X_MARGIN,
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

        const selectorRectXOptions = {
          boundsMethod: 'none',
          left: 0,
          top: 0,
          cursor: 'pointer',
          fill: 'rgb( 0, 255, 255) ',
          rectWidth: 18.7, /* just a default value */
          rectHeight: 18.7,
          cornerRadius: 2,
        };

        const selectorRectYOptions = {
          boundsMethod: 'none',
          left: 0,
          top: 0,
          cursor: 'pointer',
          fill: 'rgb( 0, 0, 255) ',
          rectWidth: 18.7, /* just a default value */
          rectHeight: 18.7,
          cornerRadius: 2,
        };

        const selectorRectYProgressOptions = {
          fill: 'rgb( 0, 0, 0) ',
          rectWidth: 18.7,
          rectHeight: 0,
          cornerRadius: 2,
        };

        const selectorRectXProgressOptions = {
          fill: 'rgb( 0, 0, 0) ',
          rectWidth: 18.7,
          rectHeight: 0,
          cornerRadius: 2,
        };

        const selectorRectsLength = NormalModesConstants.MAX_MASSES_ROW_LEN * NormalModesConstants.MAX_MASSES_ROW_LEN;

        // Franco to make handling it easier, it's a simple array (not nested), as its known how many nodes are per row
        const selectorRects = { };
        selectorRects[ model.ampSelectorAxis.HORIZONTAL ] = new Array( selectorRectsLength );
        selectorRects[ model.ampSelectorAxis.VERTICAL ] = new Array( selectorRectsLength );

        const changeSelectorRectProgress = function ( selectorRect, amplitude ) {
          const progress = selectorRect.children[ 0 ];

          //progress.bottom = selectorRect.bottom;
          const factor = ( amplitude > TwoDimensionsConstants.MAX_MODE_AMPLITUDE )? 1 : amplitude / TwoDimensionsConstants.MAX_MODE_AMPLITUDE;
          // console.log(factor)
          progress.rectHeight = selectorRect.rectHeight * factor;
        }

        for ( let i = 0; i < selectorRectsLength; i++ ) {
          selectorRects[ model.ampSelectorAxis.HORIZONTAL ][ i ] = new Rectangle( selectorRectXOptions );
          selectorRects[ model.ampSelectorAxis.VERTICAL ][ i ] = new Rectangle( selectorRectYOptions );

          const xSelector = selectorRects[ model.ampSelectorAxis.HORIZONTAL ][ i ];
          const ySelector = selectorRects[ model.ampSelectorAxis.VERTICAL ][ i ];
          ySelector.addChild( new Rectangle( selectorRectYProgressOptions ) );
          xSelector.addChild( new Rectangle( selectorRectXProgressOptions ) );

          const row = Math.trunc( i / NormalModesConstants.MAX_MASSES_ROW_LEN );
          const col = i % NormalModesConstants.MAX_MASSES_ROW_LEN;

          model.modeXAmplitudeProperty[ row ][ col ].link( ( amplitude ) => {
            changeSelectorRectProgress( xSelector, amplitude );
          } );
          model.modeYAmplitudeProperty[ row ][ col ].link( ( amplitude ) => {
            changeSelectorRectProgress( ySelector, amplitude );
          } );
        }

        const selectorBox = new Rectangle( { 
          children: selectorRects[ model.ampSelectorAxisProperty.get() ]
        } );

        const contentNode = new HBox( {
          spacing: 10,
          align: 'center',
          children: [ ampSelectorAxisRadioButtonGroup, selectorBox ]
        } );

        super( contentNode, options );

        const massesChanged = function ( numMasses ) {
          const rects = selectorBox.children;

          const gridSize = 400 / ( 1 + 6 * numMasses ); /* makes a grid with rectside = 3 units and padding = 1 unit */

          const cursor = new Vector2( gridSize, gridSize / 2 );

          let j = 0;
          let row = 0;
          for ( ; row < numMasses; row++ ) {
            const visibleRowEnd = j + numMasses;
            const rowEnd = j + NormalModesConstants.MAX_MASSES_ROW_LEN;

            for ( ; j < visibleRowEnd; j++ ) {
              rects[ j ].visible = true;
              rects[ j ].rectWidth = rects[ j ].rectHeight = 3 * gridSize;

              rects[ j ].children[ 0 ].rectWidth = rects[ j ].rectWidth;
              rects[ j ].left = cursor.x;
              rects[ j ].top = cursor.y;
              cursor.x += 4 * gridSize;
            }
            for ( ; j < rowEnd; j++ ) {
              rects[ j ].visible = false;
            }

            cursor.x = gridSize;
            cursor.y += 4 * gridSize;
          }
          for( ; j < selectorRectsLength; j++) rects[ j ].visible = false;
        }

        model.ampSelectorAxisProperty.link( function ( axis ) {
          selectorBox.children = selectorRects[ axis ];
          massesChanged( model.numVisibleMassesProperty.get() );
        } );

        model.numVisibleMassesProperty.link( massesChanged );

      }
  
      /**
       * @public
       */
      reset() {
        
      }
  
    }
    return normalModes.register( 'AmpPhaseAccordionBox', AmpPhaseAccordionBox );
  } );