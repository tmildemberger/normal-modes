// Copyright 2019, University of Colorado Boulder

/**
 * Constants used in multiple locations within this simulation.
 *
 * @author UTFPR
 */
define( require => {
    'use strict';
  
    // modules
    const normalModes = require( 'NORMAL_MODES/normalModes' );
  
    const TwoDimensionsConstants = {
  
      SCREEN_VIEW_X_MARGIN: 15,
      SCREEN_VIEW_Y_MARGIN: 15,
  
      MIN_SPEED: 0.05,
      INIT_SPEED: 1,
      MAX_SPEED: 3,
      DELTA_SPEED: 0.1,
  
      MIN_MODE_AMPLITUDE: 0,
      INIT_MODE_AMPLITUDE: 0,
      MAX_MODE_AMPLITUDE: .2, /* TODO experimentar e trocar como necessario Franco */
  
      MIN_MODE_PHASE: -Math.PI,
      INIT_MODE_PHASE: 0,
      MAX_MODE_PHASE: Math.PI,

      MASSES_MASS_VALUE: 0.1,
      SPRING_CONSTANT_VALUE: 0.1 * 4 * Math.PI ** 2,

      LEFT_WALL_X_POS: -1,
      DISTANCE_BETWEEN_X_WALLS: 2,
      TOP_WALL_Y_POS: 1,
      DISTANCE_BETWEEN_Y_WALLS: 2,

      FPS: 60,
      FIXED_DT: 1 / 60

      //TODO
    };
  
    return normalModes.register( 'TwoDimensionsConstants', TwoDimensionsConstants );
  } );