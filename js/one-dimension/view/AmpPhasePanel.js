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
    const Dimension2 = require( 'DOT/Dimension2' );
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
    const directionOfMotionString = require( 'string!NORMAL_MODES/amp-phase-panel.direction-of-motion' );
    const normalModeString = require( 'string!NORMAL_MODES/amp-phase-panel.normal-mode' );

    class AmpPhasePanel extends Panel {
  
      /**
       * @param {Object} [panelOptions]
       * @param {Model} model
       */
      constructor( panelOptions, model ) {
  
        /*
        Model properties used:
          - modeAmplitudeProperty[0..9]
          - modePhaseProperty[0..9]
          - directionOfMotionProperty
          - numVisibleMassesProperty
          - phasesVisibilityProperty
        */

        const ampSliders = new Array( NormalModesConstants.MAX_MASSES_ROW_LEN );
        const phaseSliders = new Array( NormalModesConstants.MAX_MASSES_ROW_LEN );
        const modeLabels = new Array( NormalModesConstants.MAX_MASSES_ROW_LEN );

        const ampSliderOptions = {
          delta: 0.01,
          sliderOptions: {
            orientation: 'vertical',
            trackSize: new Dimension2( 100, 3 ),
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

        // TODO trocar pi pra pi de math
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
            trackSize: new Dimension2( 100, 3 ),
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

        for(let i = 0; i < ampSliders.length; i++) {
            ampSliders[ i ] = new NumberControl(
              "",
              model.modeAmplitudeProperty[ i ],
              new RangeWithValue(OneDimensionConstants.MIN_MODE_AMPLITUDE,
                                 OneDimensionConstants.MAX_MODE_AMPLITUDE,
                                 OneDimensionConstants.INIT_MODE_AMPLUITUDE),
              ampSliderOptions
            );

            phaseSliders[ i ] = new NumberControl(
              "",
              model.modePhaseProperty[ i ],
              new RangeWithValue(OneDimensionConstants.MIN_MODE_PHASE,
                                 OneDimensionConstants.MAX_MODE_PHASE,
                                 OneDimensionConstants.INIT_MODE_PHASE),
              phaseSliderOptions
            );
          
            modeLabels[ i ] = new Text(
              ( i + 1 ).toString(),
              { font: NormalModesConstants.CONTROL_FONT }
            )
        }

        const ampBox = new HBox( {
          spacing: 6,
          align: 'left',
          children: ampSliders.slice( 0, model.numVisibleMassesProperty.get() )
        } );

        const phaseBox = new HBox( {
          spacing: -20,
          align: 'left',
          children: phaseSliders.slice( 0, model.numVisibleMassesProperty.get() )
        } );

        const labelBox = new HBox( {
          spacing: 60,
          align: 'left',
          children: modeLabels.slice( 0, model.numVisibleMassesProperty.get() )
        } );

        const labelRow = new HBox( {
          spacing: 30,
          align: 'left',
          children: [
            new Text( normalModeString, { font: NormalModesConstants.phetFont, maxWidth: 65 } ),
            labelBox
          ]
        } );

        const ampRow = new HBox ( {
          spacing: 0,
          align: 'center',
          children: [
            new Text( amplitudeString, { font: NormalModesConstants.phetFont } ),
            ampBox
          ]
        } );

        const phaseRow = new HBox ( {
          spacing: 0,
          align: 'center',
          children: [
            new Text( phaseString, { font: NormalModesConstants.phetFont } ),
            phaseBox
          ]
        } );

        const contentNode = new VBox( {
          spacing: 0,
          align: 'left',
          children: [
            labelRow,
            ampRow,
            phaseRow
          ]
        } );

        super( contentNode, panelOptions );

        const self = this;
        
        model.numVisibleMassesProperty.link(
          function() {
            ampBox.children = ampSliders.slice(0, model.numVisibleMassesProperty.get());
            phaseBox.children = phaseSliders.slice(0, model.numVisibleMassesProperty.get());
            labelBox.children = modeLabels.slice(0, model.numVisibleMassesProperty.get());

            self.centerX = panelOptions.centerX;
          } 
        );

        model.phasesVisibilityProperty.link(
          function() {
            if( model.phasesVisibilityProperty.get() ) {
              contentNode.children = [ labelRow, ampRow, phaseRow ];
            }
            else {
              contentNode.children = [ labelRow, ampRow ];
            }
          }
        )

      }
  
      /**
       * @public
       */
      reset() {
        
      }
  
    }
    return normalModes.register( 'AmpPhasePanel', AmpPhasePanel );
  } );