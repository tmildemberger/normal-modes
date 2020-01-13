// Copyright 2019, University of Colorado Boulder

/**
 * @author Thiago de Mendonça Mildemberger (UTFPR)
 */
define( require => {
  'use strict';

  // modules

  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const normalModes = require( 'NORMAL_MODES/normalModes' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Vector2Property = require( 'DOT/Vector2Property' );
  const Vector2 = require( 'DOT/Vector2' );

  class Mass {

    /**
     * @param {Vector2} equilibriumPosition
     * @param {boolean} visible
     * @param {Tandem} tandem
     */
    constructor( equilibriumPosition, visible, tandem ) {
      
      // @public {Property.<Vector2>} mass position in model coordinates when springs are at natural length
      this.equilibriumPositionProperty = new Vector2Property( equilibriumPosition, {
        tandem: tandem.createTandem( 'equilibriumPositionProperty' )
      } );

      // @public {Property.<boolean>} determines the visibility of the mass
      this.visibilityProperty = new BooleanProperty ( visible, {
        tandem: tandem.createTandem( 'visibilityProperty' )
      } );
      
      // @public {Property.<Vector2>} mass current displacement (from the equilibrium position)
      this.displacementProperty = new Vector2Property( new Vector2( 0, 0 ), {
        tandem: tandem.createTandem( 'displacementProperty' )
      } );
      
      // @public {Property.<Vector2>} mass initial displacement
      this.initialDisplacementProperty = new Vector2Property( new Vector2( 0, 0 ), {
        tandem: tandem.createTandem( 'initialDisplacementProperty' )
      } );
      
      // @public {Property.<Vector2>} mass current velocity
      this.velocityProperty = new Vector2Property( new Vector2( 0, 0 ), {
        tandem: tandem.createTandem( 'velocityProperty' )
      } );
      
      // @public {Property.<Vector2>} mass initial velocity
      this.initialVelocityProperty = new Vector2Property( new Vector2( 0, 0 ), {
        tandem: tandem.createTandem( 'initialVelocityProperty' )
      } );
      
      // @public {Property.<Vector2>} mass current acceleration
      this.accelerationProperty = new Vector2Property( new Vector2( 0, 0 ), {
        tandem: tandem.createTandem( 'accelerationProperty' )
      } );
      
      // @public {Property.<Vector2>} mass previous acceleration (for the Velocity Verlet algorithm)
      this.previousAccelerationProperty = new Vector2Property( new Vector2( 0, 0 ), {
        tandem: tandem.createTandem( 'previousAccelerationProperty' )
      } );
      
    }

    /**
     * Resets displacement, velocity and acceleration to zero.
     * @public
     */
    zeroPosition() {
      this.displacementProperty.reset();
      this.initialDisplacementProperty.reset();
      this.velocityProperty.reset();
      this.initialVelocityProperty.reset();
      this.accelerationProperty.reset();
      this.previousAccelerationProperty.reset();
    }

    /**
     * Resets all mass properties.
     * @public
     */
    reset() {
      this.equilibriumPositionProperty.reset();
      this.visibilityProperty.reset();
      this.zeroPosition();
    }
    
    /**
     * Restores displacement and velocity to stored initial values.
     * @public
     */
    restoreInitialState() {
      this.displacementProperty.set( this.initialDisplacementProperty.get() );
      this.velocityProperty.set( this.initialVelocityProperty.get() );
      this.accelerationProperty.reset();
      this.previousAccelerationProperty.reset();
    }
  }

  return normalModes.register( 'Mass', Mass );
} );