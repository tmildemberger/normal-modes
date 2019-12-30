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
    const Panel = require( 'SUN/Panel' );
    const Text = require( 'SCENERY/nodes/Text' );
    const VBox = require( 'SCENERY/nodes/VBox' );
    const inherit = require( 'PHET_CORE/inherit' );

    // strings
    const speedString = require( 'string!NORMAL_MODES/options-panel.speed' );
    const initialPositionsString = require( 'string!NORMAL_MODES/options-panel.initial-positions' );
    const zeroPositionsString = require( 'string!NORMAL_MODES/options-panel.zero-positions' );

    class OptionsPanel extends Panel {
  
      /**
       * @param {Property.<boolean>} playProperty
       * @param {Property.<number>} speedProperty
       * @param {Property.<number>} numVisibleMassesProperty
       * @param {Object} [options]
       * @param {Model} model
       */
      constructor( playProperty, speedProperty, numVisibleMassesProperty, options,  model ) {
  
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

        // vertical layout
        const contentNode = new VBox( {
          spacing: 15,
          align: 'center',
          children: [
            playPauseButton,
            initialPositionsButton,
            zeroPositionsButton
          ]
        } );
  
        super( contentNode, options );
      }
  
      /**
       * @public
       * Resets wereResidualsVisible for #161
       */
      reset() {
        this.wereResidualsVisible = false;
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