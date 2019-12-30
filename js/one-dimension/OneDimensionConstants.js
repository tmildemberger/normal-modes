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

  const OneDimensionConstants = {

    SCREEN_VIEW_X_MARGIN: 15,
    SCREEN_VIEW_Y_MARGIN: 15

    //TODO
  };

  return normalModes.register( 'OneDimensionConstants', OneDimensionConstants );
} );