// Copyright 2019, University of Colorado Boulder

/**
 * Constants used in multiple locations within this simulation.
 *
 * @author UTFPR
 */
define( require => {
    'use strict';
  
    // modules

    const Color = require( 'SCENERY/util/Color' );
    const PhetFont = require( 'SCENERY_PHET/PhetFont' );

    const normalModes = require( 'NORMAL_MODES/normalModes' );

    const NormalModesConstants = {

      /*
      Peguei algumas constantes do wave on a string
      Franco
      */
  
      SCREEN_VIEW_X_MARGIN: 15,
      SCREEN_VIEW_Y_MARGIN: 15,

      blueUpColor: new Color( 'hsl(210,70%,75%)' ),
      blueOverColor: new Color( 'hsl(210,90%,80%)' ),
      blueDisabledColor: new Color( 'rgb(180,180,180)' ),
      blueDownColor: new Color( 'hsl(210,80%,70%)' ),
      buttonBorder0: new Color( 'transparent' ),
      buttonBorder1: new Color( 'transparent' ),

      buttonBorder0: new Color( 'transparent' ),
      buttonBorder1: new Color( 'transparent' ),

      windowScale: 0.6,

      // how much the window front should overlap the window back
      windowXOffset: 5,

      // how much to horizontally shift the window (to center)
      windowShift: 1,

      phetFont: new PhetFont( 14 ),

      CONTROL_FONT: new PhetFont( 18 ),

      // number of masses in a row for both 1d and 2d
      MIN_MASSES_ROW_LEN: 1,
      INIT_MASSES_ROW_LEN: 3,
      MAX_MASSES_ROW_LEN: 10,

  
      //TODO
    };
  
    return normalModes.register( 'NormalModesConstants', NormalModesConstants );
  } );