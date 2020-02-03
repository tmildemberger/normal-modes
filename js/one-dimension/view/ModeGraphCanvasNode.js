// Copyright 2019-2020, University of Colorado Boulder

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

    const RIGHT_WALL_PADDING = 25;
    const X_LEN = 50;

    // TODO - this should be a class
    /**
     * @param {Model} [model] used to get model properties
     * @param {Object} [options] that can be passed on to the underlying node
     * @constructor
     */
    function ModeGraphCanvasNode( model, options ) {
      
      options.canvasBounds = new Bounds2( 0, 0, ( options.wallHeight )? options.graphSize.width + RIGHT_WALL_PADDING : options.graphSize.width, options.graphSize.height );
      CanvasNode.call( this, options );

      this.graphSize  = options.graphSize; // @private
      this.graphStart = { x: options.graphStartX, y: this.graphSize.height / 2 }; // @private
      this.wallHeight = options.wallHeight; // @private

      this.xStep           = this.graphSize.width / X_LEN; // @private
      this.normalModeNum   = options.normalModeNum; // @private {Number} - 0 to 9 (representing 1 to 10)
      this.curveYPositions = new Array( X_LEN ); // @private
      
      this.strokeColor = options.strokeColor || 'blue'; // @private
      this.wallColor   = options.wallColor   || 'black'; // @private
      
      this.textColor = options.textColor || 'black'; // @private
      this.fontStyle = options.fontStyle || '16px sans-serif'; // @private

      this.xRatio = options.graphSize.width; // @private
      
      this.model = model; // @private
    }
  
    normalModes.register( 'ModeGraphCanvasNode', ModeGraphCanvasNode );
  
    return inherit( CanvasNode, ModeGraphCanvasNode, {
  
      /**
       * Paints the normal mode graph.
       * @param {CanvasRenderingContext2D} context
       * @public
       */
      paintCanvas: function( context ) {

        // draw text (normal mode number)
        context.fillStyle = this.textColor;
        context.font = this.fontStyle;
        context.fillText( ( this.normalModeNum + 1).toString(), 0, this.graphStart.y + 5.5);

        // draw left wall
        context.beginPath();
        context.lineWidth = 2;
        context.strokeStyle = this.wallColor;
        context.moveTo( this.graphStart.x, this.graphStart.y + this.wallHeight / 2 );
        context.lineTo( this.graphStart.x, this.graphStart.y - this.wallHeight / 2 );
        context.stroke();

        // plot
        context.beginPath();
        context.lineWidth = 2;
        context.strokeStyle = this.strokeColor;
        context.moveTo( this.graphStart.x, this.graphStart.y );
        for ( let i = 1; i < this.curveYPositions.length; i++ ) {
          context.lineTo( this.graphStart.x + i * this.xStep, this.curveYPositions[ i ] + this.graphStart.y );
        }
        
        context.lineTo( this.graphStart.x + this.graphSize.width, this.graphStart.y );
        context.stroke();

        // draw right wall
        context.beginPath();
        context.lineWidth = 2;
        context.strokeStyle = this.wallColor;
        context.moveTo( this.graphStart.x + this.graphSize.width, this.graphStart.y + this.wallHeight / 2 );
        context.lineTo( this.graphStart.x + this.graphSize.width, this.graphStart.y - this.wallHeight / 2 );
        context.stroke();
      },
  
      update: function( ) {
        
        const n = this.normalModeNum;
        const amp = this.model.modeAmplitudeProperty[ n ].get();
        const phase = this.model.modePhaseProperty[ n ].get();
        const freq = this.model.modeFrequencyProperty[ n ].get();
        const time = this.model.timeProperty.get();

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