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
    const Color = require( 'SCENERY/util/Color' );
    const FireListener = require( 'SCENERY/listeners/FireListener' );
    const merge = require( 'PHET_CORE/merge' );
    const normalModes = require( 'NORMAL_MODES/normalModes' );
    const Rectangle = require( 'SCENERY/nodes/Rectangle' );    
    const TwoDimensionsConstants = require( 'NORMAL_MODES/two-dimensions/TwoDimensionsConstants' );

    class AmpSelectorRectNode extends Rectangle {
  
      /**
       * @param {Object} [options]
       * @param {Model} model
       */
      constructor( options, model, row, col, ampAxisProperty, maxAmpProperty, gridSizeProperty ) {

        options = merge( options, {
          boundsMethod: 'none',
          left: 0,
          top: 0,
          cursor: 'pointer',
          rectWidth: 1, /* just a default value */
          rectHeight: 1, /* just a default value */
          cornerRadius: 2,
          lineWidth: 1,
          stroke: '#202020',
          fill: 'rgb( 0, 255, 255 )',
          fillX: 'rgb( 0, 255, 255 )',
          fillY: 'rgb( 0, 0, 255 )',
          backgroundRect: {
            preventFit: true,
            boundsMethod: 'none',
            left: 0,
            top: 0,
            fill: Color.toColor( 'rgb( 0, 0, 0)' ).colorUtilsBrighter( .6 ),
            rectWidth: 1, /* just a default value */
            rectHeight: 0,
            cornerRadius: 2,
          },
          rectGridSize: 5,
          paddingGridSize: 1,
        } );

        super( options );

        this.row = row; // @private
        this.col = col; // @private

        this.backgroundRect = new Rectangle( options.backgroundRect );
        this.addChild( this.backgroundRect );

        const self = this;

        self.amplitudeChanged = function( amplitude, axis ) {
          if( model.ampSelectorAxisProperty.get() == axis ) {
            const maxAmp = maxAmpProperty.get();
            const heightFactor = Math.min( 1, amplitude / maxAmp );
            self.backgroundRect.rectHeight = self.rectHeight * ( 1 - heightFactor );
          }
        }

        self.numMassesChanged = function( numMasses ) {
          if( self.row < numMasses && self.col < numMasses ) {
            self.visible = true;
            self.rectWidth = self.rectHeight = options.rectGridSize * gridSizeProperty.get();

            self.backgroundRect.rectWidth = self.rectWidth;
            self.amplitudeChanged( ampAxisProperty.get()[ row ][ col ].get(), model.ampSelectorAxisProperty.get() );

            const gridLeft = options.paddingGridSize + self.col * ( options.paddingGridSize + options.rectGridSize );
            const gridTop = options.paddingGridSize + self.row * ( options.paddingGridSize + options.rectGridSize );
            
            self.left = gridSizeProperty.get() * gridLeft;
            self.top = gridSizeProperty.get() * gridTop;
          }
          else {
            self.visible = false;
          }
        }

        self.ampAxisChanged = function( ampSelectorAxis ) {
          self.fill = ( ampSelectorAxis == model.ampSelectorAxis.VERTICAL )? options.fillY : options.fillX;
          self.amplitudeChanged( ampAxisProperty.get()[ row ][ col ].get(), ampSelectorAxis );
        }

        model.modeXAmplitudeProperty[ row ][ col ].link( ( amplitude ) => {
          self.amplitudeChanged( amplitude, model.ampSelectorAxis.HORIZONTAL );
        } );
        model.modeYAmplitudeProperty[ row ][ col ].link( ( amplitude ) => {
          self.amplitudeChanged( amplitude, model.ampSelectorAxis.VERTICAL );
        } );

        model.numVisibleMassesProperty.link( this.numMassesChanged );

        model.ampSelectorAxisProperty.link( this.ampAxisChanged );

        const isNear = function( n1, n2 ) {
          const EPS = 10e-5;
          return n1 >= ( n2 - EPS ) && n1 <= ( n2 + EPS );
        }

        this.addInputListener( new FireListener( {
          fire: () => {
            const amp = ampAxisProperty.get()[ row ][ col ];
            amp.set( isNear( amp.get(), maxAmpProperty.get() ) ? TwoDimensionsConstants.MIN_MODE_AMPLITUDE : maxAmpProperty.get() );
          }
        } ) );

      }
  
      /**
       * @public
       */
      reset() {
        
      }
  
    }
    return normalModes.register( 'AmpSelectorRectNode', AmpSelectorRectNode );
  } );