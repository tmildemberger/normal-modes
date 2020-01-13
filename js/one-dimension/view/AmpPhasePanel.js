// Copyright 2019, University of Colorado Boulder

/**
 * Panel containing amplitude and phase selection for the normal modes.
 *
 * @author Franco Barpp Gomes (UTFPR)
 * @author Thiago de Mendonça Mildemberger (UTFPR)
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
        const frequencyText = new Array( NormalModesConstants.MAX_MASSES_ROW_LEN );

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

        const phaseSliderOptions = {
          delta: 0.01,
          sliderOptions: {
            orientation: 'vertical',
            majorTicks: [ 
              { 
                value: OneDimensionConstants.MIN_MODE_PHASE,
                label: new Text( "-\u03C0", { font: NormalModesConstants.GENERAL_FONT } ) 
              },
              { 
                value: OneDimensionConstants.INIT_MODE_PHASE,
                label: new Text( "0", { font: NormalModesConstants.GENERAL_FONT } ) 
              },
              { 
                value: OneDimensionConstants.MAX_MODE_PHASE,
                label: new Text( "\u03C0", { font: NormalModesConstants.GENERAL_FONT } ) 
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
          const k = OneDimensionConstants.SPRING_CONSTANT_VALUE;
          const m = OneDimensionConstants.MASSES_MASS_VALUE;

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
          );

          const freq = model.modeFrequencyProperty[ i ].get() / Math.sqrt( k / m );
          frequencyText[i] = new Text(
            `w = ${ freq.toFixed( 2 ) }w0`,
            { font: NormalModesConstants.GENERAL_FONT, maxWidth: 60 }
          );
        }

        const panelColumns = new Array( NormalModesConstants.MAX_MASSES_ROW_LEN + 1);

        const normalModeLabel = new Text(
          normalModeString, 
          { font: NormalModesConstants.GENERAL_FONT, maxWidth: 65 }
        );

        const amplitudeLabel = new Text(
          amplitudeString, 
          { font: NormalModesConstants.GENERAL_FONT, maxWidth: 65 }
        );

        const phaseLabel = new Text(
          phaseString, 
          { font: NormalModesConstants.GENERAL_FONT, maxWidth: 65 }
        );

        const frequencyLabel = new Text(
          frequencyString, 
          { font: NormalModesConstants.GENERAL_FONT, maxWidth: 65 }
        );
        
        /* some ugly stuff, i don't know of a better way to do those different spacings */
        panelColumns[ 0 ] = new VBox( {
          top: 5,
          spacing: 60,
          align: 'center',
          children: [ normalModeLabel, new VBox( {
            spacing: 110,
            align: 'center',
            children: [ amplitudeLabel, phaseLabel ]
          } ), frequencyLabel ]
        } );

        for(let i = 0; i < panelColumns.length - 1; i++) {
          panelColumns[ i + 1 ] = new VBox( {
            spacing: 5,
            align: 'center',
            children: ( model.phasesVisibilityProperty.get() )? 
                      [ modeLabels[ i ], ampSliders[ i ], phaseSliders[ i ], frequencyText[ i ] ] :
                      [ modeLabels[ i ], ampSliders[ i ], frequencyText[ i ] ]
          } );
        }

        const contentNode = new HBox( {
          spacing: -10,
          align: 'left',
          children: panelColumns.slice( 0, model.numVisibleMassesProperty.get() + 1 )
        } );

        super( contentNode, panelOptions );

        const self = this;
        
        model.numVisibleMassesProperty.link(
          function() {
            contentNode.children = panelColumns.slice( 0, model.numVisibleMassesProperty.get() + 1 );

            self.centerX = panelOptions.centerX;

            for(let i = 0; i < model.numVisibleMassesProperty.get(); i++) {
              const k = OneDimensionConstants.SPRING_CONSTANT_VALUE;
              const m = OneDimensionConstants.MASSES_MASS_VALUE;
              const freq = model.modeFrequencyProperty[ i ].get() / Math.sqrt( k / m );

              frequencyText[ i ].text = `\u03C9 = ${ freq.toFixed( 2 ) }\u03C9\u2080`;
            }
          } 
        );

        model.phasesVisibilityProperty.link(
          function() {
            if( model.phasesVisibilityProperty.get() ) {
              contentNode.spacing = -10;
              panelColumns[ 0 ].children[ 1 ].children = [ amplitudeLabel, phaseLabel ];
              panelColumns[ 0 ].spacing = 62.5;

              for(let i = 0; i < panelColumns.length - 1; i++) {
                panelColumns[ i + 1 ].children = [ modeLabels[ i ],
                 ampSliders[ i ], phaseSliders[ i ], frequencyText[ i ] ];
              }
            }
            else {
              contentNode.spacing = 10;
              panelColumns[ 0 ].children[ 1 ].children = [ amplitudeLabel ];
              panelColumns[ 0 ].spacing = 60;
              
              for(let i = 0; i < panelColumns.length - 1; i++) {
                panelColumns[ i + 1 ].children = [ modeLabels[ i ],
                 ampSliders[ i ], frequencyText[ i ] ];
              }
            }

            self.centerX = panelOptions.centerX;
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