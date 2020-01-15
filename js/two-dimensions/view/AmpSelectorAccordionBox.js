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
    const Property = require( 'AXON/Property' );
    const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
    const RangeWithValue = require( 'DOT/RangeWithValue' );
    const Text = require( 'SCENERY/nodes/Text' );
    const TwoDimensionsConstants = require( 'NORMAL_MODES/two-dimensions/TwoDimensionsConstants' );
    const VBox = require( 'SCENERY/nodes/VBox' );
    const VStrut = require( 'SCENERY/nodes/VStrut' );
    const Rectangle = require( 'SCENERY/nodes/Rectangle' );
    const Color = require( 'SCENERY/util/Color' );
    
    // strings
    const normalModeAmplitudesString = require( 'string!NORMAL_MODES/amp-selector-2d.normal-mode-amplitudes' );

    class AmpPhaseAccordionBox extends AccordionBox {
  
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

        const selectorWidth = options.selectorWidth;

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

        const rect1 = new VBox( {
          cursor: 'pointer',
          fill: 'rgb( 0, 0, 0) ',
          minWidth: selectorWidth,
          minHeight: selectorWidth,
          rectWidth: selectorWidth,
          rectHeight: selectorWidth
        } );

        const selectorRectOptions = {
          cursor: 'pointer',
          fill: 'rgb( 255, 255, 255) ',
          rectWidth: 20, /* just a default value */
          rectHeight: 20
        };

        const selectorRects = {
          x: new Array( NormalModesConstants.MAX_MASSES_ROW_LEN ),
          y: new Array( NormalModesConstants.MAX_MASSES_ROW_LEN )
        };
        const rows = new Array( NormalModesConstants.MAX_MASSES_ROW_LEN );

        for ( let i = 0; i < NormalModesConstants.MAX_MASSES_ROW_LEN; i++ ) {
          selectorRects.x[ i ] = new Array( NormalModesConstants.MAX_MASSES_ROW_LEN );
          selectorRects.y[ i ] = new Array( NormalModesConstants.MAX_MASSES_ROW_LEN );

          for ( let j = 0; j < NormalModesConstants.MAX_MASSES_ROW_LEN; j++ ) {
            selectorRects.x[ i ][ j ] = new Rectangle( selectorRectOptions );
            selectorRects.y[ i ][ j ] = new Rectangle( selectorRectOptions );
          }

          rows[ i ] = new HBox( { 
            spacing: 5,
            align: 'left',
            children: model.ampSelectorAxisProperty.get() == model.ampSelectorAxis.HORIZONTAL?
                      selectorRects.x[ i ] : selectorRects.y[ i ]
          } );
        }

        const selectionBox = new VBox( { 
          spacing: 5,
          align: 'left',
          children: rows
        } );

        const contentNode = new HBox( {
          spacing: 5,
          align: 'left',
          children: [ ampSelectorAxisRadioButtonGroup, selectionBox ]
        } );
        
        super( contentNode, options );

        Property.multilink( [ model.ampSelectorAxisProperty, model.numVisibleMassesProperty ], function ( axis, numMasses ) {
          if ( axis == model.ampSelectorAxis.HORIZONTAL ) {
            for ( let i = 0; i < numMasses; i++ ) {
              rows[ i ].children = selectorRects.x[ i ].slice( 0, numMasses );
            }
          }
          else {
            for ( let i = 0; i < numMasses; i++ ) {
              rows[ i ].children = selectorRects.y[ i ].slice( 0, numMasses );
            }
          }

          selectionBox.children = rows.slice( 0, numMasses );

          const gridSize = selectorWidth / ( 1 + 4 * numMasses ); /* makes a grid with rectside = 2 units and padding = 1 unit */

          for ( let i = 0; i < numMasses; i++ ) {
            rows[ i ].spacing = rows[ i ].left = gridSize;
            for ( let j = 0; j < numMasses; j++ ) {
              rows[ i ].children[ j ].rectHeight = rows[ i ].children[ j ].rectWidth = 2 * gridSize;
            }
          }

          selectionBox.spacing = gridSize;
          selectionBox.top = gridSize;
        } );

      }
  
      /**
       * @public
       */
      reset() {
        
      }
  
    }
    return normalModes.register( 'AmpPhaseAccordionBox', AmpPhaseAccordionBox );
  } );