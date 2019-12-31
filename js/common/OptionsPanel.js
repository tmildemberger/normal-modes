// Copyright 2019, University of Colorado Boulder

/**
 * Options panel for both 1D and 2D views.
 * Contains:
 *  - Play/pause button
 *  - Speed slider selector
 *  - Step button
 *  - Initial and Zero positions buttons
 *  - Number of mass nodes slider selector
 *
 * @author Franco Barpp Gomes {UTFPR}
 */
define( require => {
    'use strict';
  
    // modules
    const normalModes = require( 'NORMAL_MODES/normalModes' );
    const NormalModesConstants = require( 'NORMAL_MODES/common/NormalModesConstants' );
    const TextPushButton = require( 'SUN/buttons/TextPushButton' );
    const PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
    const NumberControl = require( 'SCENERY_PHET/NumberControl' );
    const Dimension2 = require( 'DOT/Dimension2' );
    const Panel = require( 'SUN/Panel' );
    const Text = require( 'SCENERY/nodes/Text' );
    const VBox = require( 'SCENERY/nodes/VBox' );
    const RangeWithValue = require( 'DOT/RangeWithValue' );
    const inherit = require( 'PHET_CORE/inherit' );

    // strings
    const speedString = require( 'string!NORMAL_MODES/options-panel.speed' );
    const initialPositionsString = require( 'string!NORMAL_MODES/options-panel.initial-positions' );
    const zeroPositionsString = require( 'string!NORMAL_MODES/options-panel.zero-positions' );
    const numVisibleMassesString = require( 'string!NORMAL_MODES/options-panel.num-masses' );

    class OptionsPanel extends Panel {
  
      /**
       * @param {Property.<boolean>} playProperty
       * @param {Property.<number>} speedProperty
       * @param {Property.<number>} numVisibleMassesProperty
       * @param {Object} [options]
       * @param {Model} model
       */
      constructor( playProperty, speedProperty, numVisibleMassesProperty, options, model ) {
  
        /*
        // checkboxes
        const curveCheckbox = createCheckbox( curveVisibleProperty, curveString );
        const residualsCheckbox = createCheckbox( residualsVisibleProperty, residualsString );
        const valuesCheckbox = createCheckbox( valuesVisibleProperty, valuesString );
        */

        const playPauseButtonOptions = {
          upFill: NormalModesConstants.blueUpColor,
          overFill: NormalModesConstants.blueOverColor,
          disabledFill: NormalModesConstants.blueDisabledColor,
          downFill: NormalModesConstants.blueDownColor,
          backgroundGradientColorStop0: NormalModesConstants.buttonBorder0,
          backgroundGradientColorStop1: NormalModesConstants.buttonBorder1,
          innerButtonLineWidth: 1
        };
        const playPauseButton = new PlayPauseButton( model.playProperty, {
          scale: 0.8,
          scaleFactorWhenPaused: 1.15,
          touchAreaDilation: 12,
          pauseOptions: playPauseButtonOptions,
          playOptions: playPauseButtonOptions
        } );

        // Initial Position push button class
        function InitialPositionsButton( model_ ) {
          TextPushButton.call( this, initialPositionsString, {
            listener: model_.initialPositions.bind( model_ ),
            font: NormalModesConstants.phetFont,
            baseColor: 'hsl(210,0%,85%)',
            maxWidth: 250
          });
          this.touchArea = this.localBounds.dilatedXY( 5, 20);
        }
        //normalModes.register( 'InitialPositionsButton', InitialPositionsButton);
        inherit( TextPushButton, InitialPositionsButton );

        // Zero Position push button class
        function ZeroPositionsButton( model_ ) {
          TextPushButton.call( this, zeroPositionsString, {
            listener: model_.zeroPositions.bind( model_ ),
            font: NormalModesConstants.phetFont,
            baseColor: 'hsl(210,0%,85%)',
            maxWidth: 250
          });
          this.touchArea = this.localBounds.dilatedXY( 5, 20);
        }
        //normalModes.register( 'ZeroPositionsButton', ZeroPositionsButton);
        inherit( TextPushButton, ZeroPositionsButton );

        const initialPositionsButton = new InitialPositionsButton( model );
        const zeroPositionsButton = new ZeroPositionsButton( model );

        const speedControlOptions = {
          delta: 0.1,
          sliderOptions: {
            majorTicks: [ 
              { 
                value: 0.25,
                label: new Text( "slow", { font: NormalModesConstants.phetFont } ) 
              },
              { 
                value: 3,
                label: new Text( "fast", { font: NormalModesConstants.phetFont } ) 
              },
            ],
            minorTickSpacing: 0.1,
          },
          arrowButtonOptions: {
            scale: 0
          },
          titleNodeOptions: {
            font: NormalModesConstants.SPEED_SLIDER_FONT
          },
          numberDisplayOptions: {
            font: NormalModesConstants.SPEED_SLIDER_FONT,
            scale: 0
          }
        }

        const speedControl = new NumberControl(
          speedString,
          model.speedProperty,
          new RangeWithValue( 0.25, 3, 1 ),
          speedControlOptions
        );

        const numVisibleMassesControlOptions = {
          sliderOptions: {
            majorTicks: [ 
              { value: 1, label: "" },
              { value: 10, label: "" },
            ],
            minorTickSpacing: 1
          },
          arrowButtonOptions: {
            scale: 0
          },
          titleNodeOptions: {
            font: NormalModesConstants.SPEED_SLIDER_FONT
          },
          numberDisplayOptions: {
            font: NormalModesConstants.SPEED_SLIDER_FONT,
          }
        }

        const numVisibleMassesControl = new NumberControl(
          numVisibleMassesString,
          model.numVisibleMassesProperty,
          new RangeWithValue( 1, 10, 3 ),
          numVisibleMassesControlOptions
        );
        /*
        const speedSliderOptions = {
          trackFill: 'black',
          trackSize: new Dimension2( 1, 120 ),
          thumbSize: new Dimension2( 20, 10 ),
          minorTickLineWidth: 2,
          minorTickLength: 12,
          thumbTouchAreaXDilation: 8, // supposed to make touch horizontal areas flush; see #72
          thumbMouseAreaXDilation: 8,
          thumbMouseAreaYDilation: 10
        };
        const speedSliderLabelOptions = {
          font: NormalModesConstants.phetFont,
          fill: 'black',
          maxWidth: 20
        };

        const speedSlider = new HSlider( 
          model.speedProperty,
          new Range(),
          speedString,
          speedSliderOptions,
        );
        */

        // vertical layout
        const contentNode = new VBox( {
          spacing: 15,
          align: 'center',
          children: [
            playPauseButton,
            speedControl,
            initialPositionsButton,
            zeroPositionsButton,
            numVisibleMassesControl
          ]
        } );
  
        super( contentNode, options );
      }
  
      /**
       * @public
       */
      reset() {
        
      }
  
    }
    /*
    
     * Creates a checkbox for this panel.
     * @param {Property} property
     * @param {string} label
     * @returns {Checkbox}
    
    function createCheckbox( property, label ) {
      return new Checkbox(
        new Text( label, {
          font: NormalModesConstants.CONTROL_FONT,
          maxWidth: 140 // determined empirically
        } ),
        property,
        NormalModesConstants.CHECKBOX_OPTIONS
      );
    }
    */
    return normalModes.register( 'OptionsPanel', OptionsPanel );
  } );