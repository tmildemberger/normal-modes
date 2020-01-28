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
    const DerivedProperty = require( 'AXON/DerivedProperty' );
    const FireListener = require( 'SCENERY/listeners/FireListener' );
    const HBox = require( 'SCENERY/nodes/HBox' );
    const merge = require( 'PHET_CORE/merge' );
    const normalModes = require( 'NORMAL_MODES/normalModes' );
    const NormalModesConstants = require( 'NORMAL_MODES/common/NormalModesConstants' );
    const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
    const Rectangle = require( 'SCENERY/nodes/Rectangle' );    
    const Text = require( 'SCENERY/nodes/Text' );
    const TwoDimensionsConstants = require( 'NORMAL_MODES/two-dimensions/TwoDimensionsConstants' );
    const Vector2 = require( 'DOT/Vector2' );
    
    // strings
    const normalModeAmplitudesString = require( 'string!NORMAL_MODES/amp-selector-2d.normal-mode-amplitudes' );

    const PANEL_SIZE = 270;
    const RECT_GRID_UNITS = 5;
    const PADDING_GRID_UNITS = 1;

    class AmpSelectorAccordionBox extends AccordionBox {
  
      /**
       * @param {Object} [options]
       * @param {Model} model
       */
      constructor( options, model ) {
  
        /*
        Model properties used:
          - ampSelectorAxisProperty
          - modeXAmplitudeProperty
          - modeYAmplitudeProperty
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

          titleNode: new Text( normalModeAmplitudesString, { font: NormalModesConstants.CONTROL_FONT } ),
          showTitleWhenExpanded: false

        } );

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
        const ampSelectorAxisRadioButtonGroup = new RadioButtonGroup( model.ampSelectorAxisProperty, [ {
          value: model.ampSelectorAxis.HORIZONTAL,
          node: horizontalButton
        }, {
          value: model.ampSelectorAxis.VERTICAL,
          node: verticalButton
        } ], {
          deselectedLineWidth: 1,
          selectedLineWidth: 1.5,
          cornerRadius: 8,
          deselectedButtonOpacity: 0.35,
          buttonContentXMargin: 8,
          buttonContentYMargin: 8,
          orientation: 'vertical'
        } );

        /* makes a grid with rectSize = RECT_GRID_UNITS units, padding = PADDING_GRIDE_SIZE units */
        const getGridSize = function( numMasses ) {
          return PANEL_SIZE / ( 1 + ( RECT_GRID_UNITS + PADDING_GRID_UNITS ) * numMasses );
        }

        const getMaxAmp = function() {
          return TwoDimensionsConstants.MAX_MODE_AMPLITUDE[ model.numVisibleMassesProperty.get() - 1 ];
        }

        const selectorRectOptions = {
          boundsMethod: 'none',
          left: 0,
          top: 0,
          cursor: 'pointer',
          rectWidth: RECT_GRID_UNITS * getGridSize( model.numVisibleMassesProperty.get() ),
          rectHeight: RECT_GRID_UNITS * getGridSize( model.numVisibleMassesProperty.get() ),
          cornerRadius: 2,
          lineWidth: 1,
          stroke: '#202020'
        };
        
        const selectorRectProgressOptions = {
          preventFit: true,
          boundsMethod: 'none',
          left: 0,
          top: 0,
          fill: 'hsl( 31, 95%, 94% )',
          rectWidth: selectorRectOptions.rectWidth,
          rectHeight: 0,
          cornerRadius: 2,
        };

        const selectorRectXOptions = merge( {
          fill: 'rgb( 0, 255, 255) ',
        } , selectorRectOptions);
        
        const selectorRectYOptions = merge( {
          fill: 'rgb( 0, 0, 255) ',
        } , selectorRectOptions);

        const selectorRectsLength = NormalModesConstants.MAX_MASSES_ROW_LEN * NormalModesConstants.MAX_MASSES_ROW_LEN;

        // Franco to make handling it easier, it's a simple array (not nested), as its known how many nodes are per row
        const selectorRects = { };
        selectorRects[ model.ampSelectorAxis.HORIZONTAL ] = new Array( selectorRectsLength );
        selectorRects[ model.ampSelectorAxis.VERTICAL ] = new Array( selectorRectsLength );

        const changeSelectorRectProgress = function ( selectorRect, amplitude ) {
          const progress = selectorRect.children[ 0 ];

          const maxAmp = getMaxAmp();
          const heightFactor = ( amplitude > maxAmp )? 1 : amplitude / maxAmp;
          progress.rectHeight = selectorRect.rectHeight * ( 1 - heightFactor );
          // progress.bottom = selectorRect.rectHeight;
        }

        for ( let i = 0; i < selectorRectsLength; i++ ) {
          selectorRects[ model.ampSelectorAxis.HORIZONTAL ][ i ] = new Rectangle( selectorRectXOptions );
          selectorRects[ model.ampSelectorAxis.VERTICAL ][ i ] = new Rectangle( selectorRectYOptions );

          const row = Math.trunc( i / NormalModesConstants.MAX_MASSES_ROW_LEN );
          const col = i % NormalModesConstants.MAX_MASSES_ROW_LEN;

          const xSelector = selectorRects[ model.ampSelectorAxis.HORIZONTAL ][ i ];
          const ySelector = selectorRects[ model.ampSelectorAxis.VERTICAL ][ i ];
          xSelector.addChild( new Rectangle( selectorRectProgressOptions ) );
          ySelector.addChild( new Rectangle( selectorRectProgressOptions ) );

          const isNear = function( n1, n2 ) {
            const EPS = 10e-5;
            return n1 >= ( n2 - EPS ) && n2 <= ( n2 + EPS );
          }

          xSelector.addInputListener( new FireListener( {
            fire: () => {
              const amp = model.modeXAmplitudeProperty[ row ][ col ];
              amp.set( isNear( amp.get(), getMaxAmp() ) ? TwoDimensionsConstants.MIN_MODE_AMPLITUDE : getMaxAmp() );
            }
          } ) )
          ySelector.addInputListener( new FireListener( {
            fire: () => {
              const amp = model.modeYAmplitudeProperty[ row ][ col ];
              amp.set( isNear( amp.get(), getMaxAmp() ) ? TwoDimensionsConstants.MIN_MODE_AMPLITUDE : getMaxAmp() );
            }
          } ) )

          model.modeXAmplitudeProperty[ row ][ col ].link( ( amplitude ) => {
            changeSelectorRectProgress( xSelector, amplitude );
          } );
          model.modeYAmplitudeProperty[ row ][ col ].link( ( amplitude ) => {
            changeSelectorRectProgress( ySelector, amplitude );
          } );
        }
        
        const selectorBox = new Rectangle( { 
          children: selectorRects[ model.ampSelectorAxisProperty.get() ],
          rectHeight: PANEL_SIZE,
          rectWidth: PANEL_SIZE
        } );
        
        const contentNode = new HBox( {
          spacing: 10,
          align: 'center',
          children: [ ampSelectorAxisRadioButtonGroup, selectorBox ]
        } );
        
        super( contentNode, options );
        const self = this;
        
        this.ampProperty = new DerivedProperty( [ model.ampSelectorAxisProperty ], ( selectorAxis ) => {
          return ( selectorAxis === model.ampSelectorAxis.VERTICAL ) ? model.modeYAmplitudeProperty : model.modeXAmplitudeProperty;
        } );
        const refreshSelector = function ( selectorRect, pos ) {
          const row = Math.trunc( pos / NormalModesConstants.MAX_MASSES_ROW_LEN );
          const col = pos % NormalModesConstants.MAX_MASSES_ROW_LEN;
          
          changeSelectorRectProgress( selectorRect, self.ampProperty.get()[ row ][ col ].get() );
        }

        const selectorsChanged = function ( numMasses ) {
          const rects = selectorBox.children;

          const gridSize = getGridSize( numMasses );

          const cursor = new Vector2( gridSize, gridSize / 2 );

          let j = 0;
          let row = 0;
          for ( ; row < numMasses; row++ ) {
            const visibleRowEnd = j + numMasses;
            const rowEnd = j + NormalModesConstants.MAX_MASSES_ROW_LEN;

            for ( ; j < visibleRowEnd; j++ ) {
              rects[ j ].visible = true;
              rects[ j ].rectWidth = rects[ j ].rectHeight = RECT_GRID_UNITS * gridSize;

              rects[ j ].children[ 0 ].rectWidth = rects[ j ].rectWidth;
              // rects[ j ].children[ 0 ].bottom = rects[ j ].rectHeight;
              refreshSelector( rects[ j ], j );

              rects[ j ].left = cursor.x;
              rects[ j ].top = cursor.y;
              cursor.x += ( RECT_GRID_UNITS + PADDING_GRID_UNITS ) * gridSize;
            }
            for ( ; j < rowEnd; j++ ) {
              rects[ j ].visible = false;
            }

            cursor.x = gridSize;
            cursor.y += ( RECT_GRID_UNITS + PADDING_GRID_UNITS ) * gridSize;
          }
          for( ; j < selectorRectsLength; j++ ) rects[ j ].visible = false;
        }

        model.ampSelectorAxisProperty.link( function ( axis ) {
          selectorBox.children = selectorRects[ axis ];
          // self.ampProperty = ( axis == model.ampSelectorAxis.VERTICAL )? model.modeYAmplitudeProperty : model.modeXAmplitudeProperty;
          selectorsChanged( model.numVisibleMassesProperty.get() );
        } );

        model.numVisibleMassesProperty.link( function( numMasses ) {
          selectorsChanged( numMasses );
        } );

      }
  
      /**
       * @public
       */
      reset() {
        
      }
  
    }
    return normalModes.register( 'AmpSelectorAccordionBox', AmpSelectorAccordionBox );
  } );