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
    const merge = require( 'PHET_CORE/merge' );
    const ModeGraphCanvasNode = require( 'NORMAL_MODES/one-dimension/view/ModeGraphCanvasNode' );
    const normalModes = require( 'NORMAL_MODES/normalModes' );
    const NormalModesConstants = require( 'NORMAL_MODES/common/NormalModesConstants' );
    const Text = require( 'SCENERY/nodes/Text' );
    const VBox = require( 'SCENERY/nodes/VBox' );
    
    // strings
    const normalModeString = require( 'string!NORMAL_MODES/normal-modes.title' );

    class GraphAccordionBox extends AccordionBox {
  
      /**
       * @param {Object} [options]
       * @param {Model} model
       */
      constructor( options, model ) {
  
        /*
        Model properties used:
          - timeProperty
          - numVisibleMassesProperty
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

          titleNode: new Text( normalModeString, { font: NormalModesConstants.CONTROL_FONT } ),
          showTitleWhenExpanded: false

        } );

        const normalModeGraphs = new Array( NormalModesConstants.MAX_MASSES_ROW_LEN );

        for ( let i = 0; i < normalModeGraphs.length; i++ ) {
          normalModeGraphs[ i ] = new ModeGraphCanvasNode( model, { normalModeNum: i } );
          model.timeProperty.link( ( time ) => {
              normalModeGraphs[ i ].update();
          } );
        }

        const graphContainer = new VBox( { 
          spacing: 5,
          align: 'center',
          children: normalModeGraphs
        } );

        model.numVisibleMassesProperty.link( function ( numMasses ) {
          for ( let i = 0; i < normalModeGraphs.length; i++ ) {
            normalModeGraphs[ i ].visible = ( i < numMasses );
          }
        } );

        super( graphContainer, options );

      }
  
      /**
       * @public
       */
      reset() {
        
      }
  
    }
    return normalModes.register( 'GraphAccordionBox', GraphAccordionBox );
  } );