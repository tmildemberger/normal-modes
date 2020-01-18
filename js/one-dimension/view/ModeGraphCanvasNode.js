// Copyright 2019, University of Colorado Boulder

/**
 * This node draws a normal mode graph. It is based on States of Matter's InteractionPotentialCanvasNode.
 *
 * @author Franco Barpp Gomes (UTFPR)
 */
define( require => {
    'use strict';
  
    // modules
    const ArrowShape = require( 'SCENERY_PHET/ArrowShape' );
    const CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
    const inherit = require( 'PHET_CORE/inherit' );
    const normalModes = require( 'NORMAL_MODES/normalModes' );
    const OneDimensionConstants = require( 'NORMAL_MODES/one-dimension/OneDimensionConstants' );

    // constants
    const AXIS_LINE_WIDTH = 1;
    const AXES_ARROW_HEAD_HEIGHT = 8 * AXIS_LINE_WIDTH;

    const SIGMA_HANDLE_OFFSET_PROPORTION = 0.08;  // Position of handle as function of node width.
    const EPSILON_LINE_WIDTH = 1;

    const GRAPH_SIZE = { width: 100, height: 30 };
    const GRAPH_DELTA_X = 2;
    const GRAPH_START = { x: 0, y: 0 };
  
    /**
     * @param {Model} [model] used to get model properties
     * @param {Object} [options] that can be passed on to the underlying node
     * @constructor
     */
    function ModeGraphCanvasNode( model, options ) {
      CanvasNode.call( this, options );

      this.curveYPositions = new Array( GRAPH_SIZE.width );  // @private
      this.normalModeNum = options.normalModeNum; // @private {Number} - 0 to 9 (representing 1 to 10)
      this.strokeColor = options.strokeColor || '#000000';
    }
  
    normalModes.register( 'ModeGraphCanvasNode', ModeGraphCanvasNode );
  
    return inherit( CanvasNode, ModeGraphCanvasNode, {
  
      /**
       * Paints the potential energy curve.
       * @param {CanvasRenderingContext2D} context
       * @public
       */
      paintCanvas: function( context ) {
        context.beginPath();
        context.moveTo( GRAPH_START.x, GRAPH_START.y );
        for ( let i = 1; i < this.curveYPositions.length; i++ ) {
          context.lineTo( GRAPH_START.x + i, this.curveYPositions[ i ] + GRAPH_START.y );
        }
        context.strokeStyle = this.strokeColor;
        context.lineWidth = 2;
        context.stroke();
      },
  
      update: function( ) {

        for ( let i = 1; i < this.curveYPositions.length; i++ ) {
          const n = this.normalModeNum;
          const amp = model.modeAmplitudeProperty[ n ].get();
          const phase = model.modePhaseProperty[ n ].get();
          const freq = model.modeFrequencyProperty[ n ].get();
          const time = model.timeProperty.get();
          const x = i / 10;
        
          this.curveYPositions[ i ] = GRAPH_SIZE.height * ( amp * Math.sin( x * ( n + 1 ) * Math.PI ) * Math.cos( freq * time - phase ) ) / OneDimensionConstants.MAX_MODE_AMPLITUDE;
        }

        // indicate that this should be repainted during the next paint cycle
        this.invalidatePaint();
      }
    } );
  } );