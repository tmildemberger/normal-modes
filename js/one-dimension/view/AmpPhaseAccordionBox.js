// Copyright 2019, University of Colorado Boulder

/**
 * AccordionBox containing amplitude and phase selection for the normal modes.
 *
 * @author Franco Barpp Gomes (UTFPR)
 * @author Thiago de Mendonça Mildemberger (UTFPR)
 */
define( require => {
    'use strict';
  
    // modules
    const AccordionBox = require( 'SUN/AccordionBox' );
    const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
    const Dimension2 = require( 'DOT/Dimension2' );
    const HBox = require( 'SCENERY/nodes/HBox' );
    const HStrut = require( 'SCENERY/nodes/HStrut' );
    const Line = require( 'SCENERY/nodes/Line' );
    const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
    const merge = require( 'PHET_CORE/merge' );
    const Node = require( 'SCENERY/nodes/Node' );
    const NumberControl = require( 'SCENERY_PHET/NumberControl' );
    const normalModes = require( 'NORMAL_MODES/normalModes' );
    const NormalModesConstants = require( 'NORMAL_MODES/common/NormalModesConstants' );
    const OneDimensionConstants = require( 'NORMAL_MODES/one-dimension/OneDimensionConstants' );
    const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
    const RangeWithValue = require( 'DOT/RangeWithValue' );
    const Text = require( 'SCENERY/nodes/Text' );
    const VBox = require( 'SCENERY/nodes/VBox' );
    const VStrut = require( 'SCENERY/nodes/VStrut' );
    
    // strings
    const amplitudeString = require( 'string!NORMAL_MODES/amp-selector-1d.amplitude' );
    const normalModeSpectrumString = require( 'string!NORMAL_MODES/amp-selector-1d.normal-mode-spectrum' );
    const frequencyString = require( 'string!NORMAL_MODES/amp-selector-1d.frequency' );
    const normalModeString = require( 'string!NORMAL_MODES/amp-selector-1d.normal-mode' );
    const phaseString = require( 'string!NORMAL_MODES/amp-selector-1d.phase' );

    class AmpPhaseAccordionBox extends AccordionBox {
  
      /**
       * @param {Object} [options]
       * @param {Model} model
       */
      constructor( options, model ) {
  
        /*
        Model properties used:
          - modeAmplitudeProperty[0..9]
          - modePhaseProperty[0..9]
          - directionOfMotionProperty
          - numVisibleMassesProperty
          - phasesVisibilityProperty
        */

        // from Vector Addition
        const PANEL_CORNER_RADIUS = 5;
        const PANEL_X_MARGIN = 9;
        const PANEL_Y_MARGIN = 10;

        options = merge( options, {
          resize: true,

          cornerRadius: PANEL_CORNER_RADIUS,
          contentXMargin: PANEL_X_MARGIN,
          contentYMargin: PANEL_Y_MARGIN,
          contentXSpacing: PANEL_X_MARGIN,
          contentYSpacing: 1,
          buttonXMargin: PANEL_X_MARGIN,
          buttonYMargin: PANEL_Y_MARGIN,
          titleYMargin: PANEL_Y_MARGIN,
          titleXMargin: PANEL_X_MARGIN,
          titleXSpacing: PANEL_X_MARGIN,
          titleAlignX: 'left',
          expandCollapseButtonOptions: {
            sideLength: 22,
            touchAreaXDilation: 6,
            touchAreaYDilation: 6
          },

          titleNode: new Text( normalModeSpectrumString, { font: NormalModesConstants.CONTROL_FONT } ),
          showTitleWhenExpanded: false

        } );

        const ampSliders = new Array( NormalModesConstants.MAX_MASSES_ROW_LEN );
        const phaseSliders = new Array( NormalModesConstants.MAX_MASSES_ROW_LEN );
        const modeLabels = new Array( NormalModesConstants.MAX_MASSES_ROW_LEN );
        const frequencyText = new Array( NormalModesConstants.MAX_MASSES_ROW_LEN );

        const ampSliderOptions = {
          delta: 0.01,
          sliderOptions: {
            orientation: 'vertical',
            trackSize: new Dimension2( 100, 3 ),
            thumbSize: new Dimension2( 15, 26 ),
            thumbTouchAreaXDilation: 15,
            thumbTouchAreaYDilation: 15
          },
          includeArrowButtons: false,
          layoutFunction: NumberControl.createLayoutFunction4(),
          titleNodeOptions: {
            font: NormalModesConstants.CONTROL_FONT,
            scale: 0,
          },
          numberDisplayOptions: {
            font: NormalModesConstants.CONTROL_FONT,
            scale: 0
          }
        }
        
        // majorTicks: [ 
        //   { 
        //     value: OneDimensionConstants.MIN_MODE_PHASE,
        //     label: new Text( "-\u03C0", { font: NormalModesConstants.GENERAL_FONT } ) 
        //   },
        //   { 
        //     value: OneDimensionConstants.INIT_MODE_PHASE,
        //     label: new Text( "0", { font: NormalModesConstants.GENERAL_FONT } ) 
        //   },
        //   { 
        //     value: OneDimensionConstants.MAX_MODE_PHASE,
        //     label: new Text( "\u03C0", { font: NormalModesConstants.GENERAL_FONT } ) 
        //   },
        // ]
        const phaseSliderOptions = {
          delta: 0.01,
          sliderOptions: {
            orientation: 'vertical',
            trackSize: new Dimension2( 80, 3 ),
            thumbSize: new Dimension2( 15, 26 ),
            thumbTouchAreaXDilation: 15,
            thumbTouchAreaYDilation: 15,
          },
          includeArrowButtons: false,
          layoutFunction: NumberControl.createLayoutFunction4(),
          titleNodeOptions: {
            font: NormalModesConstants.CONTROL_FONT,
            scale: 0,
          },
          numberDisplayOptions: {
            font: NormalModesConstants.CONTROL_FONT,
            scale: 0
          }
        }

        for ( let i = 0; i < ampSliders.length; i++ ) {
          const k = OneDimensionConstants.SPRING_CONSTANT_VALUE;
          const m = OneDimensionConstants.MASSES_MASS_VALUE;

          ampSliders[ i ] = new NumberControl(
            "",
            model.modeAmplitudeProperty[ i ],
            new RangeWithValue( OneDimensionConstants.MIN_MODE_AMPLITUDE,
                                OneDimensionConstants.MAX_MODE_AMPLITUDE,
                                OneDimensionConstants.INIT_MODE_AMPLUITUDE ),
            ampSliderOptions
          );

          phaseSliders[ i ] = new NumberControl(
            "",
            model.modePhaseProperty[ i ],
            new RangeWithValue( OneDimensionConstants.MIN_MODE_PHASE,
                                OneDimensionConstants.MAX_MODE_PHASE,
                                OneDimensionConstants.INIT_MODE_PHASE ),
            phaseSliderOptions
          );
        
          modeLabels[ i ] = new Text(
            ( i + 1 ).toString(),
            { font: NormalModesConstants.CONTROL_FONT }
          );

          const freq = model.modeFrequencyProperty[ i ].get() / Math.sqrt( k / m );
          frequencyText[i] = new Text(
            `${ freq.toFixed( 2 ) }\u03C9\u2080`,
            { font: NormalModesConstants.SMALL_FONT, maxWidth: 60 }
          );
        }
        
        const panelColumns = new Array( NormalModesConstants.MAX_MASSES_ROW_LEN + 1);

        const normalModeLabel = new Text(
          normalModeString,
          { font: NormalModesConstants.CONTROL_FONT, maxWidth: 120 }
        );

        const amplitudeLabel = new Text(
          amplitudeString, 
          { font: NormalModesConstants.CONTROL_FONT, maxWidth: 120 }
        );

        const phaseLabel = new Text( phaseString, { font: NormalModesConstants.CONTROL_FONT, maxWidth: 80 } );
        
        const piLabel = new Text( MathSymbols.UNARY_PLUS + MathSymbols.PI, { font: NormalModesConstants.CONTROL_FONT, maxWidth: 30 } );
        const zeroLabel = new Text( '0', { font: NormalModesConstants.CONTROL_FONT, maxWidth: 30 } );
        const negativePiLabel = new Text( MathSymbols.UNARY_MINUS + MathSymbols.PI, { font: NormalModesConstants.CONTROL_FONT, maxWidth: 30 } );

        const phaseSliderLabels = new VBox( {
          children: [ piLabel,
                      new VStrut( 16 ), // empirically determined
                      zeroLabel,
                      new VStrut( 15 ),
                      negativePiLabel ],
          align: 'right'
        } );

        const phaseBox = new HBox( {
          children: [ phaseLabel,
                      new HStrut( 10 ),
                      phaseSliderLabels ]
        } );

        const frequencyLabel = new Text(
          frequencyString, 
          { font: NormalModesConstants.CONTROL_FONT, maxWidth: 120 }
        );
        
        /* some ugly stuff, i don't know of a better way to do those different spacings */
        // panelColumns[ 0 ] = new VBox( {
        //   top: 5,
        //   spacing: 60,
        //   align: 'center',
        //   children: [ normalModeLabel, new VBox( {
        //     spacing: 110,
        //     align: 'center',
        //     children: [ amplitudeLabel, phaseLabel ]
        //   } ), frequencyLabel ]
        // } );
        // children: [ normalModeLabel, amplitudeLabel, frequencyLabel, phaseLabel ]
        
        for ( let i = 1; i < panelColumns.length; i++) {
          panelColumns[ i ] = new VBox( {
            spacing: 5,
            align: 'center'
          } );
        }

        // normalModeLabel.center = modeLabels[ 0 ].center;
        // amplitudeLabel.center = ampSliders[ 0 ].center;
        // frequencyLabel.center = frequencyText[ 0 ].center;
        // phaseLabel.center = phaseSliders[ 0 ].center;

        // normalModeLabel.centerY = modeLabels[ 0 ].centerY;
        // amplitudeLabel.centerY = ampSliders[ 0 ].centerY;
        // frequencyLabel.centerY = frequencyText[ 0 ].centerY;
        // phaseLabel.centerY = phaseSliders[ 0 ].centerY;
        // panelColumns[ 0 ] = new Node( {
        //   children: ( model.phasesVisibilityProperty.get() ) ?
        //   [ normalModeLabel, amplitudeLabel, frequencyLabel, phaseLabel ] :
        //   [ normalModeLabel, amplitudeLabel, frequencyLabel]
        // } );
        // normalModeLabel.right = panelColumns[ 0 ].right;
        // amplitudeLabel.right = panelColumns[ 0 ].right;
        // frequencyLabel.right = panelColumns[ 0 ].right;
        // phaseLabel.right = panelColumns[ 0 ].right;

        panelColumns[ 0 ] = new Node( {
          children: [ new Line( 0, 0, 10, 10 ) ]
        } );

        const lineSeparator = new Line( 0, 0, 0, 0, {
          stroke: 'gray'
        } );
        // contentNode.children.push( new Line( 0, 0, 0, 100, { stroke: 'gray' } ) );

        // spacing: -10,
        const contentNode = new HBox( {
          spacing: 10,
          align: 'center',
          children: panelColumns.slice( 0, model.numVisibleMassesProperty.get() + 1 )
        } );
        // contentNode.children.push( new Line( 0, 0, 0, 100, { stroke: 'gray' } ) );


        const RADIO_BUTTON_ICON_SIZE = 45;
        const iconSize = RADIO_BUTTON_ICON_SIZE;
        const AXES_ARROW_OPTIONS = {
          doubleHead: true,
          tailWidth: 1.5,
          headWidth: 10,
          headHeight: 10,
          fill: 'black',
          stroke: null,
          maxWidth: iconSize,
          maxHeight: iconSize
        };
        
        const horizontalButton = new ArrowNode( 0, 0, iconSize, 0, AXES_ARROW_OPTIONS );
        const verticalButton = new ArrowNode( 0, 0, 0, iconSize, AXES_ARROW_OPTIONS );
        const directionOfMotionRadioButtonGroup = new RadioButtonGroup( model.directionOfMotionProperty, [ {
          value: model.directionOfMotion.HORIZONTAL,
          node: horizontalButton
        }, {
          value: model.directionOfMotion.VERTICAL,
          node: verticalButton
        } ], {
          deselectedLineWidth: 1,
          selectedLineWidth: 1.5,
          cornerRadius: 8,
          deselectedButtonOpacity: 0.35,
          buttonContentXMargin: 8,
          buttonContentYMargin: 8,
          orientation: 'vertical'
        } )
        
        super( contentNode, options );

        const self = this;
        // console.log( this );
        
        model.phasesVisibilityProperty.link( function( phasesVisibility ) {
          for ( let i = 1; i < panelColumns.length; ++i ) {
            panelColumns[ i ].children = ( phasesVisibility ) ?
                                         [ modeLabels[ i - 1 ], ampSliders[ i - 1 ], frequencyText[ i - 1 ], phaseSliders[ i - 1 ] ] :
                                         [ modeLabels[ i - 1 ], ampSliders[ i - 1 ], frequencyText[ i - 1 ] ];
          }

          lineSeparator.setY2( panelColumns[ 1 ].bounds.height * 0.8 );

          // needed to make the Node have the same height as the VBoxes
          const strut = new VStrut( panelColumns[ 1 ].bounds.height );

          panelColumns[ 0 ].children = ( phasesVisibility ) ?
                                       [ strut, normalModeLabel, amplitudeLabel, frequencyLabel, phaseBox ] :
                                       [ strut, normalModeLabel, amplitudeLabel, frequencyLabel];
                                      
          //

          normalModeLabel.centerY = modeLabels[ 0 ].centerY;
          amplitudeLabel.centerY = ampSliders[ 0 ].centerY;
          frequencyLabel.centerY = frequencyText[ 0 ].centerY;
          phaseBox.centerY = phaseSliders[ 0 ].centerY;
          
          normalModeLabel.right = panelColumns[ 0 ].right;
          amplitudeLabel.right = panelColumns[ 0 ].right;
          frequencyLabel.right = panelColumns[ 0 ].right;
          phaseBox.right = panelColumns[ 0 ].right;
          
          self.bottom = options.bottom;
        } );
        
        model.numVisibleMassesProperty.link( function( numMasses ) {
          for ( let i = 0; i < numMasses; i++ ) {
            const k = OneDimensionConstants.SPRING_CONSTANT_VALUE;
            const m = OneDimensionConstants.MASSES_MASS_VALUE;
            const freq = model.modeFrequencyProperty[ i ].get() / Math.sqrt( k / m );
            
            frequencyText[ i ].text = `${ freq.toFixed( 2 ) }\u03C9\u2080`;
          }

          contentNode.children = panelColumns.slice( 0, numMasses + 1 );
          contentNode.addChild( lineSeparator );
          contentNode.addChild( directionOfMotionRadioButtonGroup );

          self.layout(); // needed to center based on the recalculated layout (layout should be a private method, TODO: fix)
          self.centerX = options.centerX;

        } );

        // model.phasesVisibilityProperty.link(
        //   function() {
        //     if( model.phasesVisibilityProperty.get() ) {
        //       contentNode.spacing = -10;
        //       panelColumns[ 0 ].children[ 1 ].children = [ amplitudeLabel, phaseBox ];
        //       panelColumns[ 0 ].spacing = 62.5;

        //       for(let i = 0; i < panelColumns.length - 1; i++) {
        //         panelColumns[ i + 1 ].children = [ modeLabels[ i ],
        //          ampSliders[ i ], phaseSliders[ i ], frequencyText[ i ] ];
        //       }
        //     }
        //     else {
        //       contentNode.spacing = 10;
        //       panelColumns[ 0 ].children[ 1 ].children = [ amplitudeLabel ];
        //       panelColumns[ 0 ].spacing = 60;
              
        //       for(let i = 0; i < panelColumns.length - 1; i++) {
        //         panelColumns[ i + 1 ].children = [ modeLabels[ i ],
        //          ampSliders[ i ], frequencyText[ i ] ];
        //       }
        //     }

        //     self.centerX = options.centerX;
        //   }
        // )

      }
  
      /**
       * @public
       */
      reset() {
        
      }
  
    }
    return normalModes.register( 'AmpPhaseAccordionBox', AmpPhaseAccordionBox );
  } );