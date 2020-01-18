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
    const Bounds2 = require( 'DOT/Bounds2' );
    const CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
    const inherit = require( 'PHET_CORE/inherit' );
    const normalModes = require( 'NORMAL_MODES/normalModes' );
    const OneDimensionConstants = require( 'NORMAL_MODES/one-dimension/OneDimensionConstants' );

    // constants
    const GRAPH_SIZE = { width: 100, height: 20 };
    const X_RATIO = 100;
    const GRAPH_START = { x: 0, y: GRAPH_SIZE.height / 2 };
  
    /**
     * @param {Model} [model] used to get model properties
     * @param {Object} [options] that can be passed on to the underlying node
     * @constructor
     */
    function ModeGraphCanvasNode( model, options ) {
      //options.canvasBounds = new Bounds2( 0, options.normalModeNum * 55, GRAPH_SIZE.width, GRAPH_SIZE.height );
      options.canvasBounds = new Bounds2( 0, 0, GRAPH_SIZE.width, GRAPH_SIZE.height );
      CanvasNode.call( this, options );

      this.curveYPositions = new Array( GRAPH_SIZE.width );  // @private
      this.normalModeNum = options.normalModeNum; // @private {Number} - 0 to 9 (representing 1 to 10)
      this.strokeColor = options.strokeColor || 'black';
      this.model = model;

      /*
      this.canvasEl = document.createElement( 'canvas' );
      this.canvasEl.width = GRAPH_SIZE.width;
      this.canvasEl.height = GRAPH_SIZE.height;
      this.context = this.canvasEl.getContext( '2d' );
      */
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
        
        const n = this.normalModeNum;
        const amp = this.model.modeAmplitudeProperty[ n ].get();
        const phase = this.model.modePhaseProperty[ n ].get();
        const freq = this.model.modeFrequencyProperty[ n ].get();
        const time = this.model.timeProperty.get();

        for ( let i = 1; i < this.curveYPositions.length; i++ ) {
          const x = i / X_RATIO;
        
          // Franco put a negative sign in front of it because of y coordinate stuff
          this.curveYPositions[ i ] = - ( 2 * GRAPH_SIZE.height / 3 ) * ( amp * Math.sin( x * ( n + 1 ) * Math.PI ) * Math.cos( freq * time - phase ) ) / OneDimensionConstants.MAX_MODE_AMPLITUDE;
        }

        // indicate that this should be repainted during the next paint cycle
        this.invalidatePaint();
      }
    } );
  } );