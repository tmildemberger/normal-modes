// Copyright 2019, University of Colorado Boulder

/**
 * @author UTFPR
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const Mass = require( 'NORMAL_MODES/one-dimension/model/Mass' );
  const normalModes = require( 'NORMAL_MODES/normalModes' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const OneDimensionConstants = require( 'NORMAL_MODES/one-dimension/OneDimensionConstants' );
  const Spring = require( 'NORMAL_MODES/one-dimension/model/Spring' );
  const Vector2 = require( 'DOT/Vector2' );

  const MAX_VISIBLE_MASSES = 10;
  const MAX_MASSES = MAX_VISIBLE_MASSES + 2; // tem as imoveis das pontas tb - Franco
  const MAX_SPRINGS = MAX_MASSES - 1;

  class OneDimensionModel {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      // @public {Enumeration}
      this.directionOfMotion = Enumeration.byKeys( [ 'HORIZONTAL', 'VERTICAL' ] );
      
      // @public {Property.<boolean>} determines whether the sim is in a play/pause state
      this.playingProperty = new BooleanProperty( true, {
        tandem: tandem.createTandem( 'playingProperty' )
      } );

      // @public {Property.<number>} determines the speed at which the sim plays
      this.simSpeedProperty = new NumberProperty( OneDimensionConstants.INIT_SPEED, {
        tandem: tandem.createTandem( 'simSpeedProperty' ),
        range: new Range( OneDimensionConstants.MIN_SPEED, OneDimensionConstants.MAX_SPEED )
      } );
      
      // @public {Property.<boolean>} determines visibility of the phases sliders
      this.phasesVisibilityProperty = new BooleanProperty( true, {
        tandem: tandem.createTandem( 'phasesVisibilityProperty' )
      } );

      // @public {Property.<boolean>} determines visibility of the springs
      this.springsVisibilityProperty = new BooleanProperty( true, {
        tandem: tandem.createTandem( 'springsVisibilityProperty' )
      } );

      // @public {Property.<number>} the current number of visible masses
      this.numVisibleMassesProperty = new NumberProperty( 3, {
        tandem: tandem.createTandem( 'numVisibleMassesProperty' ),
        numberType: 'Integer',
        range: new Range( 1, 10 )
      } );
      
      // @public {Property.<string>} the current direction of motion of the visible masses
      this.directionOfMotionProperty = new EnumerationProperty( this.directionOfMotion, this.directionOfMotion.VERTICAL, {
        tandem: tandem.createTandem( 'directionOfMotionProperty' )
      } );
      
      // @public {Property.<number>} the current time
      this.timeProperty = new NumberProperty( 0, {
        tandem: tandem.createTandem( 'timeProperty' )
      } );

      // @public {number} Accumulated delta-time
      this.dt = 0;
      
      this.modeAmplitudeProperty = new Array( MAX_VISIBLE_MASSES );
      this.modePhaseProperty = new Array( MAX_VISIBLE_MASSES );
      this.modeFrequencyProperty = new Array( MAX_VISIBLE_MASSES );
      for( let i = 0; i < MAX_VISIBLE_MASSES; i++ ) {
        this.modeAmplitudeProperty[ i ] = new NumberProperty( OneDimensionConstants.INIT_MODE_AMPLITUDE, {
          tandem: tandem.createTandem( 'modeAmplitudeProperty' + i ),
          range: new Range( OneDimensionConstants.MIN_MODE_AMPLITUDE, Number.POSITIVE_INFINITY ) 
          // o slider da amplitude precisa ter um máximo, mas o valor da amplitude não pode - Thiago
        } );
        
        this.modePhaseProperty[ i ] = new NumberProperty( OneDimensionConstants.INIT_MODE_PHASE, {
          tandem: tandem.createTandem( 'modePhaseProperty' + i ),
          range: new Range( OneDimensionConstants.MIN_MODE_PHASE, OneDimensionConstants.MAX_MODE_PHASE )
        } );
        
        this.modeFrequencyProperty[ i ] = new DerivedProperty( [ this.numVisibleMassesProperty ], function( numMasses ) {
          const k = OneDimensionConstants.SPRING_CONSTANT_VALUE;
          const m = OneDimensionConstants.MASSES_MASS_VALUE;
          if ( i >= numMasses ) {
            return 0;
          }
          else {
            return 2 * Math.sqrt( k / m ) * Math.sin( Math.PI / 2 * ( i + 1 ) / ( numMasses + 1 ) );
          }
        } );

        this.modeAmplitudeProperty[ i ].lazyLink( this.setExactPositions.bind( this ) );
        this.modePhaseProperty[ i ].lazyLink( this.setExactPositions.bind( this ) );
        
      }
      
      // @public {Mass[]} Array that will contain all of the masses.
      this.masses = new Array( MAX_MASSES );
      this.createDefaultMasses( tandem );

      // @public {Spring[]} Array that will contain all of the springs.
      this.springs = new Array( MAX_SPRINGS );
      this.createDefaultSprings();
      
      this.numVisibleMassesProperty.link( this.changedNumberOfMasses.bind( this ) );
      
      // @public {Property.<number>} the index of the mass being dragged
      this.draggingMassIndexProperty = new NumberProperty( 0, {
        tandem: tandem.createTandem( 'draggingMassIndexProperty' )
      } );
    }
    
    /**
     * Creates MAX_MASSES masses in the correct positions.
     * @param {number} numMasses - the current number of visible masses in the simulation
     * @private
     */
    changedNumberOfMasses( numMasses ) {

      let x = OneDimensionConstants.LEFT_WALL_X_POS;
      let xStep = OneDimensionConstants.DISTANCE_BETWEEN_WALLS / (numMasses + 1);
      let xFinal = OneDimensionConstants.LEFT_WALL_X_POS + OneDimensionConstants.DISTANCE_BETWEEN_WALLS;

      for ( let i = 0; i < MAX_MASSES; i++ ) {
        let visible = ( i <= numMasses );
        
        this.masses[ i ].equilibriumPositionProperty.set( new Vector2( x, 0 ) );
        this.masses[ i ].visibilityProperty.set( visible );
        this.masses[ i ].zeroPosition();
        
        if ( x < xFinal - xStep / 2 ) {
          x += xStep;
        }
      }

      this.computeModeAmplitudesAndPhases();
    }
    
    /**
     * Creates MAX_MASSES masses in the correct positions.
     * @param {Tandem} tandem
     * @private
     */
    createDefaultMasses( tandem ) {
      let defaultMassesNum = this.numVisibleMassesProperty.get();

      let x = OneDimensionConstants.LEFT_WALL_X_POS;
      let xStep = OneDimensionConstants.DISTANCE_BETWEEN_WALLS / (defaultMassesNum + 1);
      let xFinal = OneDimensionConstants.LEFT_WALL_X_POS + OneDimensionConstants.DISTANCE_BETWEEN_WALLS;

      for ( let i = 0; i < MAX_MASSES; i++ ) {
        let visible = ( i <= defaultMassesNum );
        
        this.masses[ i ] = new Mass( new Vector2( x, 0 ), visible, tandem.createTandem( 'mass' + i ) );
        
        if ( x < xFinal ) {
          x += xStep;
        }
      }
    }

    /**
     * Creates MAX_SPRINGS springs, connecting to the correct masses.
     * @public
     */
    createDefaultSprings() {
      for ( let i = 0; i < MAX_SPRINGS; i++ ) {
        this.springs[ i ] = new Spring( this.masses[ i ], this.masses[ i + 1 ] );
      }
    }

    /**
     * Resets the normal modes' amplitude and phase.
     * @public
     */
    resetNormalModes() {
      for(let i = 0; i < MAX_VISIBLE_MASSES; i++) {
        this.modeAmplitudeProperty[ i ].reset();
        this.modePhaseProperty[ i ].reset();
      }
    }

    /**
     * Resets the model.
     * @public
     */
    reset() {
      this.playingProperty.reset();
      this.timeProperty.reset();
      this.simSpeedProperty.reset();
      this.phasesVisibilityProperty.reset();
      this.springsVisibilityProperty.reset();
      this.numVisibleMassesProperty.reset();
      this.directionOfMotionProperty.reset();

      this.zeroPositions();   // calcula modos duas vezes no momento
      this.resetNormalModes();
    }

    /**
     * Returns masses to the initial position.
     * @public
     */
    initialPositions() {
      this.playingProperty.set( false );
      this.timeProperty.reset();

      this.setExactPositions();

      // for(let i = 0; i < MAX_MASSES; i++) {
      //   this.masses[ i ].restoreInitialState();
      // }
      
      // this.computeModeAmplitudesAndPhases();
    }

    /**
     * Zeroes the masses' positions.
     * @public
     */
    zeroPositions() {
      for ( let i = 0; i < MAX_MASSES; i++ ) {
        this.masses[ i ].zeroPosition();
      }

      this.computeModeAmplitudesAndPhases();
    }

    /**
     * Steps the model.
     * @param {number} dt - time step, in seconds
     * @public
     */
    step( dt ) {
      // If the time step > 0.15, ignore it - it probably means the user returned to the tab after
      // the tab or the browser was hidden for a while.
      dt = Math.min( dt, 0.15 );

      if ( this.playingProperty.get() ) {
        this.dt += dt;
        
        while ( this.dt >= OneDimensionConstants.FIXED_DT ) {
          this.dt -= OneDimensionConstants.FIXED_DT;
          this.singleStep( OneDimensionConstants.FIXED_DT );
        }
      }

    }
    
    /**
     * Steps the model with a given dt.
     * @param {number} dt - time step, in seconds
     * @public
     */
    singleStep( dt ) {
      dt *= this.simSpeedProperty.get()
      this.timeProperty.set( this.timeProperty.get() + dt );
      if ( this.draggingMassIndexProperty.get() > 0 ) {
        this.setVerletPositions( dt );
      }
      else {
        this.recalculateVelocityAndAcceleration( dt );
        this.setExactPositions();
      }
    }
    
    /**
     * Update positions of masses at next time step, using Velocity Verlet algorithm.
     * Needed when user has grabbed mass with mouse, making exact calculation of positions impossible.
     * @param {number} dt - time step, in seconds
     * @private
     */
    setVerletPositions( dt ) {
      const N = this.numVisibleMassesProperty.get();
      for ( let i = 1; i <= N; ++i ) {
        if ( i != this.draggingMassIndexProperty.get() ) {

          const x = this.masses[ i ].displacementProperty.get();
          const v = this.masses[ i ].velocityProperty.get();
          const a = this.masses[ i ].accelerationProperty.get();

          let displacement = x.plus( v.timesScalar( dt ) ).add( a.timesScalar( dt * dt / 2 ) );
          this.masses[ i ].displacementProperty.set( displacement );
          this.masses[ i ].previousAccelerationProperty.set( a );

        }
      }
      
      this.recalculateVelocityAndAcceleration( dt );
      
    }
    
    /**
     * Update velocity and acceleration.
     * @param {number} dt - time step, in seconds
     * @private
     */
    recalculateVelocityAndAcceleration( dt ) {
      const N = this.numVisibleMassesProperty.get();
      for ( let i = 1; i <= N; ++i ) {
        if ( i != this.draggingMassIndexProperty.get() ) {

          const k = OneDimensionConstants.SPRING_CONSTANT_VALUE;
          const m = OneDimensionConstants.MASSES_MASS_VALUE;
          const xLeft = this.masses[ i - 1 ].displacementProperty.get();
          const x = this.masses[ i ].displacementProperty.get();
          const xRight = this.masses[ i + 1 ].displacementProperty.get();
          
          this.masses[ i ].accelerationProperty.set( xLeft.plus( xRight ).subtract( x.timesScalar( 2 ) ).multiplyScalar( k / m ) );
          
          const v = this.masses[ i ].velocityProperty.get();
          const a = this.masses[ i ].accelerationProperty.get();
          const aLast = this.masses[ i ].previousAccelerationProperty.get();
          
          this.masses[ i ].velocityProperty.set( v.plus( a.plus( aLast ).multiplyScalar( dt / 2 ) ) );
          
          // provavelmente é possível fazer isso
          if ( this.directionOfMotionProperty.get() === this.directionOfMotion.HORIZONTAL ) {
            this.masses[ i ].velocityProperty.get().y = 0;
            this.masses[ i ].accelerationProperty.get().y = 0;
          }
          else {
            this.masses[ i ].velocityProperty.get().x = 0;
            this.masses[ i ].accelerationProperty.get().x = 0;
          }
          
        }
        else {
          this.masses[ i ].accelerationProperty.set( new Vector2( 0, 0 ) );
          this.masses[ i ].velocityProperty.set( new Vector2( 0, 0 ) );
        }
      }

    }

    /**
     * Update positions of masses at next time step, using exact calculation.
     * Only used if no mass is grabbed by mouse.
     * @private
     */
    setExactPositions() {
      const N = this.numVisibleMassesProperty.get();
      for ( let i = 1; i <= N; ++i ) {
        let displacement = 0;
        let velocity = 0;
        
        for ( let r = 1; r <= N; ++r ) {
          const j = r - 1;
          const modeAmplitude = this.modeAmplitudeProperty[ j ].get();
          const modeFrequency = this.modeFrequencyProperty[ j ].get();
          const modePhase = this.modePhaseProperty[ j ].get();
          displacement += modeAmplitude * Math.sin( i * r * Math.PI / ( N + 1 ) ) * Math.cos( modeFrequency * this.timeProperty.get() - modePhase );
          velocity += ( - modeFrequency ) * modeAmplitude * Math.sin( i * r * Math.PI / ( N + 1 ) ) * Math.sin( modeFrequency * this.timeProperty.get() - modePhase );
        }
        
        if ( this.directionOfMotionProperty.get() === this.directionOfMotion.HORIZONTAL ) {
          const oldY = this.masses[ i ].displacementProperty.get().y;
          const oldVelocityY = this.masses[ i ].velocityProperty.get().y;
          this.masses[ i ].displacementProperty.set( new Vector2( displacement, oldY ) );
          this.masses[ i ].velocityProperty.set( new Vector2( velocity, oldVelocityY ) );
        } else {
          const oldX = this.masses[ i ].displacementProperty.get().x;
          const oldVelocityX = this.masses[ i ].velocityProperty.get().x;
          this.masses[ i ].displacementProperty.set( new Vector2( oldX, displacement ) );
          this.masses[ i ].velocityProperty.set( new Vector2( oldVelocityX, velocity ) );
        }
      }
    }
    
    /**
     * Compute mode amplitudes and phases based on current masses displacement and velocity.
     * @private
     */
    computeModeAmplitudesAndPhases() {
      this.timeProperty.reset();
      for ( let i = 1; i <= MAX_VISIBLE_MASSES; ++i ) {
        this.masses[ i ].initialDisplacementProperty.set( this.masses[ i ].displacementProperty.get() );
        this.masses[ i ].initialVelocityProperty.set( this.masses[ i ].velocityProperty.get() );
      }
      const N = this.numVisibleMassesProperty.get();
      for ( let i = 1; i <= N; ++i ) { // for each mode
        let AmplitudeTimesCosPhase = 0;
        let AmplitudeTimesSinPhase = 0;
        for ( let j = 1; j <= N; ++j ) { // for each mass
          let massDisplacement = 0;
          let massVelocity = 0;
          if ( this.directionOfMotionProperty.get() === this.directionOfMotion.HORIZONTAL ) {
            massDisplacement = this.masses[ j ].initialDisplacementProperty.get().x;
            massVelocity = this.masses[ j ].initialVelocityProperty.get().x;
          } else {
            massDisplacement = this.masses[ j ].initialDisplacementProperty.get().y;
            massVelocity = this.masses[ j ].initialVelocityProperty.get().y;
          }
          
          AmplitudeTimesCosPhase += ( 2 / ( N + 1 ) ) * massDisplacement * Math.sin( i * j * Math.PI / ( N + 1 ) );
          AmplitudeTimesSinPhase += ( 2 / ( this.modeFrequencyProperty[ i - 1 ].get() * ( N + 1 ) ) ) * massVelocity * Math.sin( i * j * Math.PI / ( N + 1 ) );
        }
        this.modeAmplitudeProperty[ i - 1 ].set( Math.sqrt( AmplitudeTimesCosPhase ** 2 + AmplitudeTimesSinPhase ** 2 ) );
        this.modePhaseProperty[ i - 1 ].set( Math.atan2( AmplitudeTimesSinPhase, AmplitudeTimesCosPhase ) );
      }
    }
    
  }

  return normalModes.register( 'OneDimensionModel', OneDimensionModel );
} );