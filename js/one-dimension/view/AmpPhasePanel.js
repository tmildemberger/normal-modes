// Copyright 2019, University of Colorado Boulder

/**
 * Panel containing amplitude and phase selection for the normal modes.
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
    const HSeparator = require( 'SUN/HSeparator' );
    const Text = require( 'SCENERY/nodes/Text' );
    const VBox = require( 'SCENERY/nodes/VBox' );
    const HBox = require( 'SCENERY/nodes/HBox' );
    const RangeWithValue = require( 'DOT/RangeWithValue' );
    const inherit = require( 'PHET_CORE/inherit' );

    // strings
    const amplitudeString = require( 'string!NORMAL_MODES/amp-phase-panel.amplitude' );
    const phaseString = require( 'string!NORMAL_MODES/amp-phase-panel.phase' );
    const frequencyString = require( 'string!NORMAL_MODES/amp-phase-panel.frequency' );
    const polarizationControlString = 
        require( 'string!NORMAL_MODES/amp-phase-panel.polarization-control' );
    const normalModeString = require( 'string!NORMAL_MODES/amp-phase-panel.normal-mode' );

    class AmpPhasePanel extends Panel {
  
      /**
       * @param {Object} [panelOptions]
       * @param {Model} model
       */
      constructor( panelOptions, model, doShowPhases=false ) {
  
        /*
        Model properties used:
          - modeAmplitudeProperty[0..9]
          - modePhaseProperty[0..9]
          - polarizationControlProperty
        */

        const sliderVBoxes = new Array( NormalModesConstants.MAX_MASSES_ROW_LEN );
        const ampSliders = new Array( NormalModesConstants.MAX_MASSES_ROW_LEN );
        const phaseSliders = new Array( NormalModesConstants.MAX_MASSES_ROW_LEN );

        const ampSliderOptions = {
          delta: 0.01,
          sliderOptions: {
            orientation: 'vertical'
          },
          arrowButtonOptions: {
            scale: 0
          },
          titleNodeOptions: {
            font: NormalModesConstants.CONTROL_FONT,
          },
          numberDisplayOptions: {
            font: NormalModesConstants.CONTROL_FONT,
            scale: 0
          }
        }

        const phaseSliderOptions = {
          delta: 0.01,
          sliderOptions: {
            orientation: 'vertical',
            majorTicks: [ 
              { 
                value: OneDimensionConstants.MIN_MODE_PHASE,
                label: new Text( "-pi", { font: NormalModesConstants.phetFont } ) 
              },
              { 
                value: OneDimensionConstants.INIT_MODE_PHASE,
                label: new Text( "0", { font: NormalModesConstants.phetFont } ) 
              },
              { 
                value: OneDimensionConstants.MAX_MODE_PHASE,
                label: new Text( "pi", { font: NormalModesConstants.phetFont } ) 
              },
            ],
          },
          arrowButtonOptions: {
            scale: 0
          },
          titleNodeOptions: {
            font: NormalModesConstants.CONTROL_FONT,
            scale: 0,
          },
          numberDisplayOptions: {
            font: NormalModesConstants.CONTROL_FONT,
            scale: 0
          }
        }

        for(let i = 0; i < sliderVBoxes.length; i++) {
            ampSliders[i] = new NumberControl(
              (i+1).toString(),
              model.modeAmplitudeProperty[i],
              new RangeWithValue(OneDimensionConstants.MIN_MODE_AMPLITUDE,
                                 OneDimensionConstants.MAX_MODE_AMPLITUDE,
                                 OneDimensionConstants.INIT_MODE_AMPLUITUDE),
              ampSliderOptions
            );

            phaseSliders[i] = new NumberControl(
              "",
              model.modePhaseProperty[i],
              new RangeWithValue(OneDimensionConstants.MIN_MODE_PHASE,
                                 OneDimensionConstants.MAX_MODE_PHASE,
                                 OneDimensionConstants.INIT_MODE_PHASE),
              phaseSliderOptions
            );
          
            sliderVBoxes[i] = new VBox( {
              spacing: 15,
              children: [
                ampSliders[i],
                phaseSliders[i]
              ],
              maxHeight: 300
            } );
        }
        
        // TODO ver um bom jeito de colocar o texto Normal Mode
        const textsContainer = new VBox( {
          spacing: 120,
          align: 'center',
          children: [
            new Text( amplitudeString, { font: NormalModesConstants.phetFont }),
            new Text( phaseString, { font: NormalModesConstants.phetFont }),
          ]
        } );

        const slidersContainer = new HBox( {
          align: 'center',
          children: sliderVBoxes.slice(0, model.numVisibleMassesProperty.get())
        } );

        const contentNode = new HBox( {
          spacing: 0,
          align: 'center',
          children: [
            textsContainer,
            slidersContainer
          ]
        } );

        model.numVisibleMassesProperty.link(
          function() {
            slidersContainer.children = sliderVBoxes.slice(0, model.numVisibleMassesProperty.get());
          } 
        );

        model.showPhasesProperty.link(
          function() {
            phaseSliders.forEach( (slider) => {
              slider.visible = model.showPhasesProperty.get();
            } );
            textsContainer.children[1].visible = model.showPhasesProperty.get();            
          }
        )
  
        super( contentNode, panelOptions );
      }
  
      /**
       * @public
       */
      reset() {
        
      }
  
    }
    return normalModes.register( 'AmpPhasePanel', AmpPhasePanel );
  } );