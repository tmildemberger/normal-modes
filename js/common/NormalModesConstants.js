// Copyright 2019, University of Colorado Boulder

/**
 * Constants used in multiple locations within this simulation.
 *
 * @author Thiago de Mendonça Mildemberger (UTFPR)
 * @author Franco Barpp Gomes (UTFPR)
 */
define( require => {
    'use strict';
  
    // modules

    const Color = require( 'SCENERY/util/Color' );
    const PhetFont = require( 'SCENERY_PHET/PhetFont' );

    const normalModes = require( 'NORMAL_MODES/normalModes' );

    const NormalModesConstants = {
  
    SCREEN_VIEW_X_MARGIN: 15,
    SCREEN_VIEW_Y_MARGIN: 15,

    // play button (based on waves on a string sim)
    BLUE_BTN_UP_COLOR: new Color( 'hsl(210,70%,75%)' ),
    BLUE_BTN_OVER_COLOR: new Color( 'hsl(210,90%,80%)' ),
    BLUE_BTN_DISABLED_COLOR: new Color( 'rgb(180,180,180)' ),
    BLUE_BTN_DOWN_COLOR: new Color( 'hsl(210,80%,70%)' ),
    BLUE_BTN_BORDER_0: new Color( 'transparent' ),
    BLUE_BTN_BORDER_1: new Color( 'transparent' ),

    windowScale: 0.6,

    // how much the window front should overlap the window back
    windowXOffset: 5,

    // how much to horizontally shift the window (to center)
    windowShift: 1,

    SMALL_FONT: new PhetFont( 13 ),
    GENERAL_FONT: new PhetFont( 14 ),
    CONTROL_FONT: new PhetFont( 18 ),

    // number of masses in a row for both 1d and 2d
    MIN_MASSES_ROW_LEN: 1,
    INIT_MASSES_ROW_LEN: 3,
    MAX_MASSES_ROW_LEN: 10,

    };
  
    return normalModes.register( 'NormalModesConstants', NormalModesConstants );
  } );