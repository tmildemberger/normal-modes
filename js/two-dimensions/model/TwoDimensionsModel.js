// Copyright 2019-2020, University of Colorado Boulder

/**
 * @author Thiago de Mendonça Mildemberger (UTFPR)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const Mass = require( 'NORMAL_MODES/common/model/Mass' );
  const normalModes = require( 'NORMAL_MODES/normalModes' );
  const NormalModesConstants = require( 'NORMAL_MODES/common/NormalModesConstants' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Property = require( 'AXON/Property' );
  const Spring = require( 'NORMAL_MODES/common/model/Spring' );
  const TwoDimensionsConstants = require( 'NORMAL_MODES/two-dimensions/TwoDimensionsConstants' );
  const Vector2 = require( 'DOT/Vector2' );

  const MAX_MASSES = NormalModesConstants.MAX_MASSES_ROW_LEN + 2;
  const MAX_SPRINGS = MAX_MASSES - 1;

  class TwoDimensionsModel {
    // TODO - comment code

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {
      
      // @public {Property.<boolean>} determines whether the sim is in a play/pause state
      this.playingProperty = new BooleanProperty( true, {
        tandem: tandem.createTandem( 'playingProperty' )
      } );

      // @public {Property.<number>} determines the speed at which the sim plays
      this.simSpeedProperty = new NumberProperty( TwoDimensionsConstants.INIT_SPEED, {
        tandem: tandem.createTandem( 'simSpeedProperty' ),
        range: new Range( TwoDimensionsConstants.MIN_SPEED, TwoDimensionsConstants.MAX_SPEED )
      } );

      // @public {Property.<boolean>} determines visibility of the springs
      this.springsVisibilityProperty = new BooleanProperty( true, {
        tandem: tandem.createTandem( 'springsVisibilityProperty' )
      } );

      // @public {Property.<number>} the current number of visible masses in each row
      this.numVisibleMassesProperty = new NumberProperty( 2, {
        tandem: tandem.createTandem( 'numVisibleMassesProperty' ),
        numberType: 'Integer',
        range: new Range( 1, 10 )
      } );
      
      // @public {Property.<number>} the current time
      this.timeProperty = new NumberProperty( 0, {
        tandem: tandem.createTandem( 'timeProperty' )
      } );

      // @public {number} Accumulated delta-time
      this.dt = 0;
      
      this.modeXAmplitudeProperty = new Array( NormalModesConstants.MAX_MASSES_ROW_LEN );
      this.modeYAmplitudeProperty = new Array( NormalModesConstants.MAX_MASSES_ROW_LEN );
      this.modeXPhaseProperty = new Array( NormalModesConstants.MAX_MASSES_ROW_LEN );
      this.modeYPhaseProperty = new Array( NormalModesConstants.MAX_MASSES_ROW_LEN );
      this.modeFrequencyProperty = new Array( NormalModesConstants.MAX_MASSES_ROW_LEN );
      for( let i = 0; i < NormalModesConstants.MAX_MASSES_ROW_LEN; i++ ) {
        this.modeXAmplitudeProperty[ i ] = new Array( NormalModesConstants.MAX_MASSES_ROW_LEN );
        this.modeYAmplitudeProperty[ i ] = new Array( NormalModesConstants.MAX_MASSES_ROW_LEN );
        this.modeXPhaseProperty[ i ] = new Array( NormalModesConstants.MAX_MASSES_ROW_LEN );
        this.modeYPhaseProperty[ i ] = new Array( NormalModesConstants.MAX_MASSES_ROW_LEN );
        this.modeFrequencyProperty[ i ] = new Array( NormalModesConstants.MAX_MASSES_ROW_LEN );

        for ( let j = 0; j < NormalModesConstants.MAX_MASSES_ROW_LEN; ++j ) {
          this.modeXAmplitudeProperty[ i ][ j ] = new NumberProperty( TwoDimensionsConstants.INIT_MODE_AMPLITUDE, {
            tandem: tandem.createTandem( 'modeXAmplitudeProperty' + i + '_' + j ),
            range: new Range( TwoDimensionsConstants.MIN_MODE_AMPLITUDE, Number.POSITIVE_INFINITY )
          } );

          this.modeYAmplitudeProperty[ i ][ j ] = new NumberProperty( TwoDimensionsConstants.INIT_MODE_AMPLITUDE, {
            tandem: tandem.createTandem( 'modeYAmplitudeProperty' + i + '_' + j ),
            range: new Range( TwoDimensionsConstants.MIN_MODE_AMPLITUDE, Number.POSITIVE_INFINITY )
          } );
          
          this.modeXPhaseProperty[ i ][ j ] = new NumberProperty( TwoDimensionsConstants.INIT_MODE_PHASE, {
            tandem: tandem.createTandem( 'modeXPhaseProperty' + i + '_' + j ),
            range: new Range( TwoDimensionsConstants.MIN_MODE_PHASE, TwoDimensionsConstants.MAX_MODE_PHASE )
          } );
          
          this.modeYPhaseProperty[ i ][ j ] = new NumberProperty( TwoDimensionsConstants.INIT_MODE_PHASE, {
            tandem: tandem.createTandem( 'modeYPhaseProperty' + i + '_' + j ),
            range: new Range( TwoDimensionsConstants.MIN_MODE_PHASE, TwoDimensionsConstants.MAX_MODE_PHASE )
          } );
          
          this.modeFrequencyProperty[ i ][ j ] = new DerivedProperty( [ this.numVisibleMassesProperty ], function( numMasses ) {
            const k = TwoDimensionsConstants.SPRING_CONSTANT_VALUE;
            const m = TwoDimensionsConstants.MASSES_MASS_VALUE;
            if ( i >= numMasses || j >= numMasses ) {
              return 0;
            }
            else {
              let omegaI = 2 * Math.sqrt( k / m ) * Math.sin( Math.PI / 2 * ( i + 1 ) / ( numMasses + 1 ) );
              let omegaJ = 2 * Math.sqrt( k / m ) * Math.sin( Math.PI / 2 * ( j + 1 ) / ( numMasses + 1 ) );
              return Math.sqrt( omegaI ** 2 + omegaJ ** 2);
            }
          } );

        }
        
      }
      
      // @public {Mass[][]} Array with the arrays that will contain all of the masses.
      this.masses = new Array( MAX_MASSES );
      for ( let i = 0; i < MAX_MASSES; ++i ) {
        this.masses[ i ] = new Array( MAX_MASSES );
      }
      this.createDefaultMasses( tandem );
      
      // @public {Spring[][]} Array with the arrays that will contain all of the springs.
      this.springsX = new Array( MAX_SPRINGS );
      this.springsY = new Array( MAX_SPRINGS );
      for ( let i = 0; i < MAX_SPRINGS; ++i ) {
        this.springsX[ i ] = new Array( MAX_SPRINGS );
        this.springsY[ i ] = new Array( MAX_SPRINGS );
      }
      this.createDefaultSprings();
      
      this.numVisibleMassesProperty.link( this.changedNumberOfMasses.bind( this ) );
      
      // @public {Property.<number[]|null>} the indexes of the mass being dragged (an object with and 'i' and a 'j')
      this.draggingMassIndexesProperty = new Property( null, {
        tandem: tandem.createTandem( 'draggingMassIndexesProperty' )
      } );

      // @public {Property.<boolean>} determines visibility of the arrows on the masses
      this.arrowsVisibilityProperty = new BooleanProperty( true, {
        tandem: tandem.createTandem( 'arrowsVisibilityProperty' )
      } );

      // @public {Enumeration}
      this.ampSelectorAxis = Enumeration.byKeys( [ 'HORIZONTAL', 'VERTICAL' ] );

      // @public {Property.<string>} the current direction of motion of the visible masses
      this.ampSelectorAxisProperty = new EnumerationProperty( this.ampSelectorAxis, this.ampSelectorAxis.VERTICAL, {
        tandem: tandem.createTandem( 'ampSelectorAxisProperty' )
      } );

    }

    /**
     * Calculates the sine products.
     * @param {number} numMasses - the current number of visible masses in the simulation
     * @private
     */
    calculateSineProducts( numMasses ) {
      const N = numMasses;
      this.sineProduct = [];
      for ( let i = 1; i <= N; ++i ) {
        this.sineProduct[ i ] = [];
        for ( let j = 1; j <= N; ++j ) {
          this.sineProduct[ i ][ j ] = [];
          
          for ( let r = 1; r <= N; ++r ) {
            this.sineProduct[ i ][ j ][ r ] = [];
            for ( let s = 1; s <= N; ++s ) {

              this.sineProduct[ i ][ j ][ r ][ s ] = Math.sin( j * r * Math.PI / ( N + 1 ) ) * Math.sin( i * s * Math.PI / ( N + 1 ) );
            }
          }
        }
      }
    }
    
    /**
     * Creates MAX_MASSES masses in the correct positions.
     * @param {number} numMasses - the current number of visible masses in the simulation
     * @private
     */
    changedNumberOfMasses( numMasses ) {

      let x = TwoDimensionsConstants.LEFT_WALL_X_POS;
      let xStep = TwoDimensionsConstants.DISTANCE_BETWEEN_X_WALLS / (numMasses + 1);
      let xFinal = TwoDimensionsConstants.LEFT_WALL_X_POS + TwoDimensionsConstants.DISTANCE_BETWEEN_X_WALLS;
      
      let y = TwoDimensionsConstants.TOP_WALL_Y_POS;
      let yStep = TwoDimensionsConstants.DISTANCE_BETWEEN_Y_WALLS / (numMasses + 1);
      let yFinal = TwoDimensionsConstants.TOP_WALL_Y_POS - TwoDimensionsConstants.DISTANCE_BETWEEN_Y_WALLS;

      for ( let i = 0; i < MAX_MASSES; i++ ) {
        x = TwoDimensionsConstants.LEFT_WALL_X_POS;
        for ( let j = 0; j < MAX_MASSES; ++j ) {
          let visible = ( i <= numMasses && j <= numMasses );
          
          this.masses[ i ][ j ].equilibriumPositionProperty.set( new Vector2( x, y ) );
          this.masses[ i ][ j ].visibilityProperty.set( visible );
          this.masses[ i ][ j ].zeroPosition();
          
          if ( x < xFinal - xStep / 2 ) {
            x += xStep;
          }

        }
        if ( y > yFinal + yStep / 2 ) {
          y -= yStep;
        }
      }

      this.calculateSineProducts( numMasses );
      this.computeModeAmplitudesAndPhases();
    }
    
    /**
     * Creates MAX_MASSES masses in the correct positions.
     * @param {Tandem} tandem
     * @private
     */
    createDefaultMasses( tandem ) {
      let defaultMassesNum = this.numVisibleMassesProperty.get();

      let x = TwoDimensionsConstants.LEFT_WALL_X_POS;
      let xStep = TwoDimensionsConstants.DISTANCE_BETWEEN_X_WALLS / (defaultMassesNum + 1);
      let xFinal = TwoDimensionsConstants.LEFT_WALL_X_POS + TwoDimensionsConstants.DISTANCE_BETWEEN_X_WALLS;
      
      let y = TwoDimensionsConstants.TOP_WALL_Y_POS;
      let yStep = TwoDimensionsConstants.DISTANCE_BETWEEN_Y_WALLS / (defaultMassesNum + 1);
      let yFinal = TwoDimensionsConstants.TOP_WALL_Y_POS + TwoDimensionsConstants.DISTANCE_BETWEEN_Y_WALLS;

      for ( let i = 0; i < MAX_MASSES; i++ ) {
        for ( let j = 0; j < MAX_MASSES; ++j ) {
          let visible = ( i <= defaultMassesNum && j <= defaultMassesNum );
          
          this.masses[ i ][ j ] = new Mass( new Vector2( x, y ), visible, tandem.createTandem( 'mass' + i + '_' + j ) );

          if ( x < xFinal - xStep / 2 ) {
            x += xStep;
          }

        }
        if ( y < yFinal - yStep / 2 ) {
          y += yStep;
        }
      }
      this.calculateSineProducts( defaultMassesNum );
    }

    /**
     * Creates MAX_SPRINGS springs, connecting to the correct masses.
     * @public
     */
    createDefaultSprings() {
      for ( let i = 0; i < MAX_SPRINGS; i++ ) {
        for ( let j = 0; j < MAX_SPRINGS; ++j ) {
          if ( i !== MAX_SPRINGS - 1 ) this.springsX[ i ][ j ] = new Spring( this.masses[ i + 1 ][ j ], this.masses[ i + 1 ][ j + 1 ] );
          if ( j !== MAX_SPRINGS - 1 ) this.springsY[ i ][ j ] = new Spring( this.masses[ i ][ j + 1 ], this.masses[ i + 1 ][ j + 1 ] );
        }
      }
    }

    /**
     * Resets the normal modes' amplitude and phase.
     * @public
     */
    resetNormalModes() {
      for ( let i = 0; i < NormalModesConstants.MAX_MASSES_ROW_LEN; i++ ) {
        for ( let j = 0; j < NormalModesConstants.MAX_MASSES_ROW_LEN; j++ ) {
          this.modeXAmplitudeProperty[ i ][ j ].reset();
          this.modeYAmplitudeProperty[ i ][ j ].reset();
          this.modeXPhaseProperty[ i ][ j ].reset();
          this.modeYPhaseProperty[ i ][ j ].reset();
        }
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
      this.springsVisibilityProperty.reset();
      this.numVisibleMassesProperty.reset();
      this.draggingMassIndexesProperty.reset();
      this.arrowsVisibilityProperty.reset();

      this.zeroPositions();
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
    }

    /**
     * Zeroes the masses' positions.
     * @public
     */
    zeroPositions() {
      for ( let i = 0; i < MAX_MASSES; i++ ) {
        for ( let j = 0; j < MAX_MASSES; j++ ) {
          this.masses[ i ][ j ].zeroPosition();
        }
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
        
        while ( this.dt >= TwoDimensionsConstants.FIXED_DT ) {
          this.dt -= TwoDimensionsConstants.FIXED_DT;
          this.singleStep( TwoDimensionsConstants.FIXED_DT );
        }
      }
      else if ( this.draggingMassIndexesProperty.get() == null ) {
        this.setExactPositions();
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
      if ( this.draggingMassIndexesProperty.get() != null ) {
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
        for ( let j = 1; j <= N; ++j ) {
          const dragging = this.draggingMassIndexesProperty.get();
          if ( !dragging || dragging.i != i || dragging.j != j ) {
  
            const x = this.masses[ i ][ j ].displacementProperty.get();
            const v = this.masses[ i ][ j ].velocityProperty.get();
            const a = this.masses[ i ][ j ].accelerationProperty.get();
  
            let displacement = x.plus( v.timesScalar( dt ) ).add( a.timesScalar( dt * dt / 2 ) );
            this.masses[ i ][ j ].displacementProperty.set( displacement );
            this.masses[ i ][ j ].previousAccelerationProperty.set( a );
  
          }
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
        for ( let j = 1; j <= N; ++j ) {
          const dragging = this.draggingMassIndexesProperty.get();
          if ( !dragging || dragging.i != i || dragging.j != j ) {

            const k = TwoDimensionsConstants.SPRING_CONSTANT_VALUE;
            const m = TwoDimensionsConstants.MASSES_MASS_VALUE;
            const sLeft = this.masses[ i ][ j - 1 ].displacementProperty.get();
            const sAbove = this.masses[ i - 1 ][ j ].displacementProperty.get();
            const s = this.masses[ i ][ j ].displacementProperty.get();
            const sRight = this.masses[ i ][ j + 1 ].displacementProperty.get();
            const sUnder = this.masses[ i + 1 ][ j ].displacementProperty.get();
            
            this.masses[ i ][ j ].accelerationProperty.set( sLeft.plus( sRight ).plus( sAbove ).plus( sUnder ).subtract( s.timesScalar( 4 ) ).multiplyScalar( k / m ) );
            
            const v = this.masses[ i ][ j ].velocityProperty.get();
            const a = this.masses[ i ][ j ].accelerationProperty.get();
            const aLast = this.masses[ i ][ j ].previousAccelerationProperty.get();
            
            this.masses[ i ][ j ].velocityProperty.set( v.plus( a.plus( aLast ).multiplyScalar( dt / 2 ) ) );
          }
          else {
            this.masses[ i ][ j ].accelerationProperty.set( new Vector2( 0, 0 ) );
            this.masses[ i ][ j ].velocityProperty.set( new Vector2( 0, 0 ) );
          }
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
      
      this.amplitudeXTimesCos = [];
      this.amplitudeYTimesCos = [];
      this.freqTimesAmplitudeXTimesSin = [];
      this.freqTimesAmplitudeYTimesSin = [];
      for ( let r = 1; r <= N; ++r ) {
        this.amplitudeXTimesCos[ r ] = [];
        this.amplitudeYTimesCos[ r ] = [];
        this.freqTimesAmplitudeXTimesSin[ r ] = [];
        this.freqTimesAmplitudeYTimesSin[ r ] = [];
        for ( let s = 1; s <= N; ++s ) {
          const modeAmplitudeX = this.modeXAmplitudeProperty[ r - 1 ][ s - 1 ].get();
          const modeAmplitudeY = this.modeYAmplitudeProperty[ r - 1 ][ s - 1 ].get();
          const modeFrequency = this.modeFrequencyProperty[ r - 1 ][ s - 1 ].get();
          const modePhaseX = this.modeXPhaseProperty[ r - 1 ][ s - 1 ].get();
          const modePhaseY = this.modeYPhaseProperty[ r - 1 ][ s - 1 ].get();

          const freqTimesTime = modeFrequency * this.timeProperty.get();
          const freqTimesTimeMinusPhsX = freqTimesTime - modePhaseX;
          const freqTimesTimeMinusPhsY = freqTimesTime - modePhaseY;

          this.amplitudeXTimesCos[ r ][ s ] = modeAmplitudeX * Math.cos( freqTimesTimeMinusPhsX );
          this.amplitudeYTimesCos[ r ][ s ] = modeAmplitudeY * Math.cos( freqTimesTimeMinusPhsY );
          
          this.freqTimesAmplitudeXTimesSin[ r ][ s ] = - modeFrequency * modeAmplitudeX * Math.sin( freqTimesTimeMinusPhsX );
          this.freqTimesAmplitudeYTimesSin[ r ][ s ] = - modeFrequency * modeAmplitudeY * Math.sin( freqTimesTimeMinusPhsY );
        }
      }
      for ( let i = 1; i <= N; ++i ) {
        for ( let j = 1; j <= N; ++j ) {
          let displacement = new Vector2( 0, 0 );
          let velocity = new Vector2( 0, 0 );
          
          const sineProductMatrix = this.sineProduct[ i ][ j ];
          for ( let r = 1; r <= N; ++r ) {
            const sineProductArray = sineProductMatrix[ r ];
            for ( let s = 1; s <= N; ++s ) {
              const sineProduct = sineProductArray[ s ];

              displacement.x += sineProduct * this.amplitudeXTimesCos[ r ][ s ];
              displacement.y -= sineProduct * this.amplitudeYTimesCos[ r ][ s ];
              
              velocity.x += sineProduct * this.freqTimesAmplitudeXTimesSin[ r ][ s ];
              velocity.y -= sineProduct * this.freqTimesAmplitudeYTimesSin[ r ][ s ];
            }
          }
          
          this.masses[ i ][ j ].displacementProperty.set( displacement );
          this.masses[ i ][ j ].velocityProperty.set( velocity );
          
        }
      }
    }
    
    /**
     * Compute mode amplitudes and phases based on current masses displacement and velocity.
     * @private
     */
    computeModeAmplitudesAndPhases() {
      this.timeProperty.reset();
      const N = this.numVisibleMassesProperty.get();
      for ( let i = 1; i <= N; ++i ) {
        for ( let j = 1; j <= N; ++j ) {
          this.masses[ i ][ j ].initialDisplacementProperty.set( this.masses[ i ][ j ].displacementProperty.get() );
          this.masses[ i ][ j ].initialVelocityProperty.set( this.masses[ i ][ j ].velocityProperty.get() );
        }
      }
      for ( let r = 1; r <= N; ++r ) {
        for ( let s = 1; s <= N; ++s ) { // for each mode
          let AmplitudeTimesCosPhaseX = 0;
          let AmplitudeTimesSinPhaseX = 0;
          let AmplitudeTimesCosPhaseY = 0;
          let AmplitudeTimesSinPhaseY = 0;
          for ( let i = 1; i <= N; ++i ) {
            for ( let j = 1; j <= N; ++j ) { // for each mass
              const massDisplacement = this.masses[ i ][ j ].initialDisplacementProperty.get();
              const massVelocity = this.masses[ i ][ j ].initialVelocityProperty.get();
              const modeFrequency = this.modeFrequencyProperty[ r - 1 ][ s - 1 ].get();
              const constantTimesSineProduct = ( 4 / ( ( N + 1 ) * ( N + 1 ) ) ) * this.sineProduct[ i ][ j ][ r ][ s ];
              
              AmplitudeTimesCosPhaseX += constantTimesSineProduct * massDisplacement.x;
              AmplitudeTimesCosPhaseY -= constantTimesSineProduct * massDisplacement.y;
              AmplitudeTimesSinPhaseX += ( constantTimesSineProduct / modeFrequency ) * massVelocity.x;
              AmplitudeTimesSinPhaseY -= ( constantTimesSineProduct / modeFrequency ) * massVelocity.y;
            }

          }
          this.modeXAmplitudeProperty[ r - 1 ][ s - 1 ].set( Math.sqrt( AmplitudeTimesCosPhaseX ** 2 + AmplitudeTimesSinPhaseX ** 2 ) );
          this.modeYAmplitudeProperty[ r - 1 ][ s - 1 ].set( Math.sqrt( AmplitudeTimesCosPhaseY ** 2 + AmplitudeTimesSinPhaseY ** 2 ) );
          this.modeXPhaseProperty[ r - 1 ][ s - 1 ].set( Math.atan2( AmplitudeTimesSinPhaseX, AmplitudeTimesCosPhaseX ) );
          this.modeYPhaseProperty[ r - 1 ][ s - 1 ].set( Math.atan2( AmplitudeTimesSinPhaseY, AmplitudeTimesCosPhaseY ) );
        }
      }
    }
    
  }

  return normalModes.register( 'TwoDimensionsModel', TwoDimensionsModel );
} );