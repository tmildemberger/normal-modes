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
    const Dimension2 = require( 'DOT/Dimension2' );
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
    const VStrut = require( 'SCENERY/nodes/VStrut' );

    // strings
    const speedString = require( 'string!NORMAL_MODES/options-panel.speed' );
    const slowString = require( 'string!NORMAL_MODES/options-panel.slow' );
    const normalString = require( 'string!NORMAL_MODES/options-panel.normal' );
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
       
        // TODO - create text on a separate line
        const showSpringsCheckbox = new Checkbox( new Text( showSpringsString, { font: NormalModesConstants.GENERAL_FONT } ), model.springsVisibilityProperty, {
          boxWidth: 16
        } );
        showSpringsCheckbox.touchArea = showSpringsCheckbox.localBounds.dilatedXY( 10, 6 );
        
        let showPhasesCheckbox = null;
        let checkboxes = null;
        
        // TODO - refactor
        if( doShowPhases ) {
          showPhasesCheckbox = new Checkbox( new Text( showPhasesString, { font: NormalModesConstants.GENERAL_FONT, } ), model.phasesVisibilityProperty, {
            boxWidth: 16
          } );
          showPhasesCheckbox.touchArea = showPhasesCheckbox.localBounds.dilatedXY( 10, 6 );
          checkboxes = new VBox( { 
            spacing: 7,
            children: [
              showSpringsCheckbox,
              showPhasesCheckbox
            ]
          });
        }
        else { /* !doShowPhases */
          checkboxes = new VBox( { 
            spacing: 7,
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

        // TODO - magic numbers
        const playPauseButton = new PlayPauseButton( model.playingProperty, {
          radius: 18,
          scaleFactorWhenPaused: 1.15,
          touchAreaDilation: 18,
          pauseOptions: playPauseButtonOptions,
          playOptions: playPauseButtonOptions
        } );

        const stepButton = new StepForwardButton( {
          radius: 18,
          touchAreaDilation: 15,
          isPlayingProperty: model.playingProperty,
          listener: function() { model.singleStep( OneDimensionConstants.FIXED_DT ); },
        } );

        // TODO - rename
        const strut = new VStrut( playPauseButton.height * 1.15 );

        const playAndStepButtons = new HBox( {
          spacing: 7,
          align: 'center',
          children: [
            playPauseButton,
            strut,
            stepButton
          ]
        } );

        // TODO - magic numbers
        const textButtonsOptions = {
          font: NormalModesConstants.GENERAL_FONT,
          baseColor: 'hsl(210,0%,85%)',

          touchAreaXDilation: 10,
          touchAreaYDilation: 16,
          touchAreaYShift: 6,
          mouseAreaXDilation: 5,
          mouseAreaYDilation: 5,

          buttonAppearanceStrategy: RectangularButtonView.FlatAppearanceStrategy,
          lineWidth: 1.5,
          xMargin: 11,
          yMargin: 3,
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

        const createLayoutFunction5 = function( options ) {

          options = merge( {
            align: 'center', // {string} horizontal alignment of rows, 'left'|'right'|'center'
            titleXSpacing: 5, // {number} horizontal spacing between title and number
            arrowButtonsXSpacing: 15, // {number} horizontal spacing between arrow buttons and slider
            ySpacing: 3 // {number} vertical spacing between rows
          }, options );
    
          return ( titleNode, numberDisplay, slider, leftArrowButton, rightArrowButton ) => {
            const includeArrowButtons = !!leftArrowButton; // if there aren't arrow buttons, then exclude them
            return new VBox( {
              align: options.align,
              spacing: options.ySpacing,
              children: [
                new HBox( {
                  spacing: options.titleXSpacing,
                  children: [ titleNode, numberDisplay ]
                } ),
                new HBox( {
                  spacing: options.arrowButtonsXSpacing,
                  resize: false, // prevent slider from causing a resize when thumb is at min or max
                  children: !includeArrowButtons ? [ slider ] : [
                    leftArrowButton,
                    slider,
                    rightArrowButton
                  ]
                } )
              ]
            } );
          };
        };

        const speedControlOptions = {
          delta: OneDimensionConstants.DELTA_SPEED,
          layoutFunction: createLayoutFunction5(),
          includeArrowButtons: false,
          sliderOptions: {
            trackSize: new Dimension2( 150, 3 ),
            thumbSize: new Dimension2( 11, 19 ),
            thumbTouchAreaXDilation: 12,
            thumbTouchAreaYDilation: 15,
            majorTickLength: 10,
            minorTickLength: 5,
            majorTicks: [ 
              { 
                value: OneDimensionConstants.MIN_SPEED,
                label: new Text( slowString, { font: NormalModesConstants.REALLY_SMALL_FONT } ) 
              },
              { 
                value: OneDimensionConstants.INIT_SPEED,
                label: new Text( normalString, { font: NormalModesConstants.REALLY_SMALL_FONT } ) 
              },
              { 
                value: OneDimensionConstants.MAX_SPEED,
                label: new Text( fastString, { font: NormalModesConstants.REALLY_SMALL_FONT } ) 
              },
            ],
            minorTickSpacing: OneDimensionConstants.DELTA_SPEED,
          },
          titleNodeOptions: {
            font: NormalModesConstants.GENERAL_FONT
          },
          numberDisplayOptions: {
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

        const temp = new VBox( {
          align: 'center',
          children: [ playAndStepButtons, speedControl ]
        } );

        const numVisibleMassesControlOptions = {
          layoutFunction: createLayoutFunction5(),
          includeArrowButtons: false,
          sliderOptions: {
            trackSize: new Dimension2( 150, 3 ),
            thumbSize: new Dimension2( 11, 19 ),
            thumbTouchAreaXDilation: 12,
            thumbTouchAreaYDilation: 15,
            majorTickLength: 10,
            minorTickLength: 5,
            majorTicks: [ 
              { value: NormalModesConstants.MIN_MASSES_ROW_LEN, label: "" },
              { value: NormalModesConstants.MAX_MASSES_ROW_LEN, label: "" },
            ],
            minorTickSpacing: NormalModesConstants.MIN_MASSES_ROW_LEN
          },
          titleNodeOptions: {
            font: NormalModesConstants.GENERAL_FONT
          },
          numberDisplayOptions: {
            font: NormalModesConstants.GENERAL_FONT
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
          spacing: 7,
          align: 'center',
          children: [
            temp,
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