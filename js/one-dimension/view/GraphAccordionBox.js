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
    const merge = require( 'PHET_CORE/merge' );
    const ModeGraphCanvasNode = require( 'NORMAL_MODES/one-dimension/view/ModeGraphCanvasNode' );
    const normalModes = require( 'NORMAL_MODES/normalModes' );
    const NormalModesConstants = require( 'NORMAL_MODES/common/NormalModesConstants' );
    const Property = require( 'AXON/Property' );
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
          - modeAmplitudeProperty[0..9]
          - modePhaseProperty[0..9]
        */

        // from Vector Addition
        const PANEL_CORNER_RADIUS = 5;
        const PANEL_X_MARGIN = 7;
        const PANEL_Y_MARGIN = 8;

        const titleNode = new Text( normalModeString, { font: NormalModesConstants.CONTROL_FONT } );

        options = merge( options, {
          resize: true,

          cornerRadius: PANEL_CORNER_RADIUS,
          contentXMargin: 15,
          contentYMargin: PANEL_Y_MARGIN,
          contentXSpacing: PANEL_X_MARGIN,
          contentYSpacing: 1,
          buttonXMargin: PANEL_X_MARGIN,
          buttonYMargin: PANEL_Y_MARGIN,
          titleYMargin: PANEL_Y_MARGIN,
          titleXMargin: PANEL_X_MARGIN,
          titleXSpacing: PANEL_X_MARGIN,
          titleAlignX: 'center',
          expandCollapseButtonOptions: {
            sideLength: 18,
            touchAreaXDilation: 6,
            touchAreaYDilation: 6
          },

          titleNode: titleNode,
          showTitleWhenExpanded: true

        } );

        const normalModeGraphs = new Array( NormalModesConstants.MAX_MASSES_ROW_LEN );

        // TODO - separate the mode number and right align it
        for ( let i = 0; i < normalModeGraphs.length; i++ ) {
          normalModeGraphs[ i ] = new ModeGraphCanvasNode( model, {
            normalModeNum: i,
            graphSize: { width: 133, height: 22 },
            graphStartX: 25,
            wallHeight: 8
          } );

          Property.multilink( [ model.timeProperty, model.modeAmplitudeProperty[ i ], model.modePhaseProperty[ i ] ], function ( time, amp, phase ) {
            normalModeGraphs[ i ].update();
          } );
        }

        const graphContainer = new VBox( { 
          spacing: 4.8,
          align: 'center',
          children: normalModeGraphs
        } );

        super( graphContainer, options );

        const self = this;

        Property.multilink( [ model.numVisibleMassesProperty, this.expandedProperty ], function ( numMasses, isExpanded ) { 
          graphContainer.children = normalModeGraphs.slice( 0, numMasses );
          graphContainer.children.forEach( ( graph ) => graph.update() );
          self.layout();
        } );

      }
  
      /**
       * @public
       */
      reset() {
        // NO-OP
      }
  
    }
    return normalModes.register( 'GraphAccordionBox', GraphAccordionBox );
  } );