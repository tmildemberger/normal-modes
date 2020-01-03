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
    const OneDimensionConstants = require( 'NORMAL_MODES/one-dimension/OneDimensionConstants' );
    const TextPushButton = require( 'SUN/buttons/TextPushButton' );
    const StepButton = require( 'SCENERY_PHET/buttons/StepButton' );
    const PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
    const NumberControl = require( 'SCENERY_PHET/NumberControl' );
    const Panel = require( 'SUN/Panel' );
    const Checkbox = require( 'SUN/Checkbox' );
    const Text = require( 'SCENERY/nodes/Text' );
    const VBox = require( 'SCENERY/nodes/VBox' );
    const HBox = require( 'SCENERY/nodes/HBox' );
    const RangeWithValue = require( 'DOT/RangeWithValue' );
    const inherit = require( 'PHET_CORE/inherit' );

    // strings
    const speedString = require( 'string!NORMAL_MODES/options-panel.speed' );
    const slowString = require( 'string!NORMAL_MODES/options-panel.slow' );
    const fastString = require( 'string!NORMAL_MODES/options-panel.fast' );
    const showSpringsString = require( 'string!NORMAL_MODES/options-panel.show-springs' );
    const showPhasesString = require( 'string!NORMAL_MODES/options-panel.show-phases' );
    const initialPositionsString = require( 'string!NORMAL_MODES/options-panel.initial-positions' );
    const zeroPositionsString = require( 'string!NORMAL_MODES/options-panel.zero-positions' );
    const numVisibleMassesString = require( 'string!NORMAL_MODES/options-panel.num-masses' );

    class OptionsPanel extends Panel {
  
      /**
       * @param {Object} [panelOptions]
       * @param {Model} model
       * @param {bool} doShowPhases
       */
      constructor( panelOptions, model, doShowPhases=false ) {
  
        /*
        Model properties used:
          - playProperty
          - speedProperty
          - numVisibleMassesProperty
          - showSpringsProperty
          - showPhasesProperty (if 1D)
        */

        const showSpringsCheckbox = new Checkbox(
          new Text( showSpringsString, {
            font: NormalModesConstants.phetFont,
            maxWidth: 140
          } ),
          model.showSpringsProperty
        );

        // TODO
        // ver se tem um jeito melhor de fazer isso

        let showPhasesCheckbox = null;
        let checkboxes = null;

        if( doShowPhases ) {
          showPhasesCheckbox = new Checkbox(
            new Text( showPhasesString, {
              font: NormalModesConstants.phetFont,
              maxWidth: 140
            } ),
            model.showPhasesProperty
          );
          checkboxes = new VBox( { 
            spacing: 15,
            children: [
              showSpringsCheckbox,
              showPhasesCheckbox
            ]
          });
        }
        else { /* model.showPhasesProperty */
          checkboxes = new VBox( { 
            spacing: 15,
            children: [
              showSpringsCheckbox
            ]
          })
        }

        // TODO - Franco
        // To passando o model como parametro,
        // mas seria bom tirar dps e talvez mandar
        // so os callbacks, to pensando em um jeito

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

        const stepButton = new StepButton( {
          isPlayingProperty: model.playProperty
        } );

        const playAndStepButtons = new HBox( {
          spacing: 15,
          align: 'center',
          children: [
            playPauseButton,
            stepButton
          ]
        } );

        // Initial Position push button class
        function InitialPositionsButton( model_ ) {
          TextPushButton.call( this, initialPositionsString, {
            listener: model_.initialPositions.bind( model_ ),
            font: NormalModesConstants.CONTROL_FONT,
            baseColor: 'hsl(210,0%,85%)',
            maxWidth: 250
          });
          this.touchArea = this.localBounds.dilatedXY( 5, 20 );
        }
        //normalModes.register( 'InitialPositionsButton', InitialPositionsButton);
        inherit( TextPushButton, InitialPositionsButton );

        // Zero Position push button class
        function ZeroPositionsButton( model_ ) {
          TextPushButton.call( this, zeroPositionsString, {
            listener: model_.zeroPositions.bind( model_ ),
            font: NormalModesConstants.CONTROL_FONT,
            baseColor: 'hsl(210,0%,85%)',
            maxWidth: 250
          });
          this.touchArea = this.localBounds.dilatedXY( 5, 20 );
        }
        //normalModes.register( 'ZeroPositionsButton', ZeroPositionsButton);
        inherit( TextPushButton, ZeroPositionsButton );

        const initialPositionsButton = new InitialPositionsButton( model );
        const zeroPositionsButton = new ZeroPositionsButton( model );

        const speedControlOptions = {
          delta: OneDimensionConstants.DELTA_SPEED,
          sliderOptions: {
            majorTicks: [ 
              { 
                value: OneDimensionConstants.MIN_SPEED,
                label: new Text( slowString, { font: NormalModesConstants.phetFont } ) 
              },
              { 
                value: OneDimensionConstants.MAX_SPEED,
                label: new Text( fastString, { font: NormalModesConstants.phetFont } ) 
              },
            ],
            minorTickSpacing: OneDimensionConstants.DELTA_SPEED,
          },
          arrowButtonOptions: {
            scale: 0
          },
          titleNodeOptions: {
            font: NormalModesConstants.CONTROL_FONT
          },
          numberDisplayOptions: {
            font: NormalModesConstants.CONTROL_FONT,
            scale: 0
          }
        }

        const speedControl = new NumberControl(
          speedString,
          model.speedProperty,
          new RangeWithValue( OneDimensionConstants.MIN_SPEED,
                              OneDimensionConstants.MAX_SPEED,
                              OneDimensionConstants.INIT_SPEED ),
          speedControlOptions
        );

        const numVisibleMassesControlOptions = {
          sliderOptions: {
            majorTicks: [ 
              { value: NormalModesConstants.MIN_MASSES_ROW_LEN, label: "" },
              { value: NormalModesConstants.MAX_MASSES_ROW_LEN, label: "" },
            ],
            minorTickSpacing: NormalModesConstants.MIN_MASSES_ROW_LEN
          },
          arrowButtonOptions: {
            scale: 0
          },
          titleNodeOptions: {
            font: NormalModesConstants.CONTROL_FONT
          },
          numberDisplayOptions: {
            font: NormalModesConstants.CONTROL_FONT,
          }
        }

        const numVisibleMassesControl = new NumberControl(
          numVisibleMassesString,
          model.numVisibleMassesProperty,
          new RangeWithValue( NormalModesConstants.MIN_MASSES_ROW_LEN,
                              NormalModesConstants.MAX_MASSES_ROW_LEN,
                              NormalModesConstants.INIT_MASSES_ROW_LEN ),
          numVisibleMassesControlOptions
        );

        // vertical layout
        const contentNode = new VBox( {
          spacing: 15,
          align: 'center',
          children: [
            playAndStepButtons,
            speedControl,
            initialPositionsButton,
            zeroPositionsButton,
            numVisibleMassesControl,
            checkboxes
          ]
        } );
  
        super( contentNode, panelOptions );
      }
  
      /**
       * @public
       */
      reset() {
        
      }
  
    }

    return normalModes.register( 'OptionsPanel', OptionsPanel );
  } );