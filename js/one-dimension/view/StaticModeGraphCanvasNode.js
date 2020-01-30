// Copyright 2019, University of Colorado Boulder

/**
 * This node draws a normal mode graph. It is based on States of Matter's InteractionPotentialCanvasNode.
 *
 * @author Franco Barpp Gomes (UTFPR)
 */
define( require => {
    'use strict';
  
    // modules
    const Bounds2 = require( 'DOT/Bounds2' );
    const CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
    const inherit = require( 'PHET_CORE/inherit' );
    const normalModes = require( 'NORMAL_MODES/normalModes' );
    const OneDimensionConstants = require( 'NORMAL_MODES/one-dimension/OneDimensionConstants' )
  
    // constants
    const X_LEN = 100;

    /**
     * @param {Model} [model] used to get model properties
     * @param {Object} [options] that can be passed on to the underlying node
     * @constructor
     */
    function StaticModeGraphCanvasNode( model, options ) {
      
      options.canvasBounds = new Bounds2( 0, 0, options.graphSize.width, options.graphSize.height );
      CanvasNode.call( this, options );

      this.graphSize  = options.graphSize; // @private
      this.graphStart = { x: options.graphStartX, y: this.graphSize.height / 2 }; // @private

      this.xStep           = this.graphSize.width / X_LEN; // @private
      this.normalModeNum   = options.normalModeNum; // @private {Number} - 0 to 9 (representing 1 to 10)
      this.curveYPositions = new Array( X_LEN );  // @private
      
      this.strokeColor        = options.strokeColor        || 'blue'; // @private
      this.refLineStrokeColor = options.refLineStrokeColor || 'black'; // @private
      
      this.xRatio = options.graphSize.width; // @private
      
      this.model = model; // @private
    }
  
    normalModes.register( 'StaticModeGraphCanvasNode', StaticModeGraphCanvasNode );
  
    return inherit( CanvasNode, StaticModeGraphCanvasNode, {
  
      /**
       * Paints the static normal mode graph.
       * @param {CanvasRenderingContext2D} context
       * @public
       */
      paintCanvas: function( context ) {

        // draw reference line
        context.beginPath();
        context.strokeStyle = this.refLineStrokeColor;
        context.lineWidth = 2;
        context.moveTo( this.graphStart.x, this.graphStart.y );
        context.lineTo( this.graphStart.x + this.graphSize.width, this.graphStart.y );
        context.stroke();

        // plot
        context.beginPath();
        context.moveTo( this.graphStart.x, this.graphStart.y );
        for ( let i = 1; i < this.curveYPositions.length; i++ ) {
          context.lineTo( this.graphStart.x + i * this.xStep, this.curveYPositions[ i ] + this.graphStart.y );
        }
        context.lineTo( this.graphStart.x + this.graphSize.width, this.graphStart.y );

        context.strokeStyle = this.strokeColor;
        context.lineWidth = 2;
        context.stroke();
      },
  
      update: function( ) {
        
        const n = this.normalModeNum;
        const amp = 0.15;
        const phase = 0;
        const freq = this.model.modeFrequencyProperty[ n ].get();
        const time = 0;

        for ( let i = 0; i < this.curveYPositions.length; i++ ) {
          const x = i / X_LEN;
        
          // put a negative sign in front of it because of y coordinate stuff
          this.curveYPositions[ i ] = - ( 2 * this.graphSize.height / 3 ) * ( amp * Math.sin( x * ( n + 1 ) * Math.PI ) * Math.cos( freq * time - phase ) ) / OneDimensionConstants.MAX_MODE_AMPLITUDE;
        }

        // indicate that this should be repainted during the next paint cycle
        this.invalidatePaint();
      }
    } );
  } );