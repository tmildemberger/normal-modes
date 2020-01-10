// Copyright 2019, University of Colorado Boulder

/**
 * @author Thiago de Mendonça Mildemberger (UTFPR)
 */
define( require => {
  'use strict';

  // modules

  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const normalModes = require( 'NORMAL_MODES/normalModes' );

  class Spring {

    /**
     * @param {Mass} leftMass
     * @param {Mass} rightMass
     */
    constructor( leftMass, rightMass ) {
      
      // @private (read-only) Non-property attributes
      this.leftMass = leftMass;
      this.rightMass = rightMass;
    
      // @public {Property.<boolean>} determines the visibility of the spring
      this.visibilityProperty = new DerivedProperty ( [ this.leftMass.visibilityProperty, this.rightMass.visibilityProperty ], function( leftVisible, rightVisible ) {
        return leftVisible; // && rightVisible; chuncho
      } );
      
    }

    /**
     * Resets the model.
     * @public
     */
    reset() {
      // Nothing to reset
    }
    
  }

  return normalModes.register( 'Spring', Spring );
} );