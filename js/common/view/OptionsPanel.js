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
    const Checkbox = require( 'SUN/Checkbox' );
    const HBox = require( 'SCENERY/nodes/HBox' );
    const merge = require( 'PHET_CORE/merge' );
    const normalModes = require( 'NORMAL_MODES/normalModes' );
    const NormalModesConstants = require( 'NORMAL_MODES/common/NormalModesConstants' );
    const NumberControl = require( 'SCENERY_PHET/NumberControl' );
    const OneDimensionConstants = require( 'NORMAL_MODES/one-dimension/OneDimensionConstants' );
    const Panel = require( 'SUN/Panel' );
    const PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
    const RangeWithValue = require( 'DOT/RangeWithValue' );
    const RectangularButtonView = require( 'SUN/buttons/RectangularButtonView' );
    const StepForwardButton = require( 'SCENERY_PHET/buttons/StepForwardButton' );
    const Text = require( 'SCENERY/nodes/Text' );
    const TextPushButton = require( 'SUN/buttons/TextPushButton' );
    const VBox = require( 'SCENERY/nodes/VBox' );

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
          - playingProperty
          - simSpeedProperty
          - numVisibleMassesProperty
          - springsVisibilityProperty
          - phasesVisibilityProperty (if 1D)
        */

        const showSpringsCheckbox = new Checkbox(
          new Text( showSpringsString, {
            font: NormalModesConstants.GENERAL_FONT,
            maxWidth: 140
          } ),
          model.springsVisibilityProperty
        );

        let showPhasesCheckbox = null;
        let checkboxes = null;

        if( doShowPhases ) {
          showPhasesCheckbox = new Checkbox(
            new Text( showPhasesString, {
              font: NormalModesConstants.GENERAL_FONT,
              maxWidth: 140
            } ),
            model.phasesVisibilityProperty
          );
          checkboxes = new VBox( { 
            spacing: 15,
            children: [
              showSpringsCheckbox,
              showPhasesCheckbox
            ]
          });
        }
        else { /* !doShowPhases */
          checkboxes = new VBox( { 
            spacing: 15,
            children: [
              showSpringsCheckbox
            ]
          })
        }

        const playPauseButtonOptions = {
          upFill: NormalModesConstants.BLUE_BTN_UP_COLOR,
          overFill: NormalModesConstants.BLUE_BTN_OVER_COLOR,
          disabledFill: NormalModesConstants.BLUE_BTN_DISABLED_COLOR,
          downFill: NormalModesConstants.BLUE_BTN_DOWN_COLOR,
          backgroundGradientColorStop0: NormalModesConstants.BLUE_BTN_BORDER_0,
          backgroundGradientColorStop1: NormalModesConstants.BLUE_BTN_BORDER_1,
          innerButtonLineWidth: 1
        };

        const playPauseButton = new PlayPauseButton( model.playingProperty, {
          scale: 0.8,
          scaleFactorWhenPaused: 1.15,
          touchAreaDilation: 12,
          pauseOptions: playPauseButtonOptions,
          playOptions: playPauseButtonOptions
        } );

        const stepButton = new StepForwardButton( {
          isPlayingProperty: model.playingProperty,
          listener: function() { model.singleStep( OneDimensionConstants.FIXED_DT ); },
        } );

        const playAndStepButtons = new HBox( {
          spacing: 15,
          align: 'center',
          children: [
            playPauseButton,
            stepButton
          ]
        } );

        const textButtonsOptions = {
          font: NormalModesConstants.CONTROL_FONT,
          baseColor: 'hsl(210,0%,85%)',
          maxWidth: 250,

          touchAreaXDilation: 10,
          touchAreaYDilation: 20,
          mouseAreaXDilation: 5,
          mouseAreaYDilation: 5,

          buttonAppearanceStrategy: RectangularButtonView.FlatAppearanceStrategy,
          lineWidth: 2,
          stroke: '#202020'
        };

        // Initial positions button
        const initialPositionsButton = new TextPushButton( initialPositionsString, merge( {
          listener: model.initialPositions.bind(model)
        }, textButtonsOptions ) );

        // Zero positions button
        const zeroPositionsButton = new TextPushButton( zeroPositionsString, merge( {
          listener: model.zeroPositions.bind(model)
        }, textButtonsOptions ) );

        const speedControlOptions = {
          delta: OneDimensionConstants.DELTA_SPEED,
          sliderOptions: {
            majorTicks: [ 
              { 
                value: OneDimensionConstants.MIN_SPEED,
                label: new Text( slowString, { font: NormalModesConstants.GENERAL_FONT } ) 
              },
              { 
                value: OneDimensionConstants.MAX_SPEED,
                label: new Text( fastString, { font: NormalModesConstants.GENERAL_FONT } ) 
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
          model.simSpeedProperty,
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
        // NO-OP
      }
  
    }

    return normalModes.register( 'OptionsPanel', OptionsPanel );
  } );