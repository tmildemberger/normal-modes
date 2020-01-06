// Copyright 2019, University of Colorado Boulder

/**
 * @author UTFPR
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const normalModes = require( 'NORMAL_MODES/normalModes' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const OneDimensionConstants = require( 'NORMAL_MODES/one-dimension/OneDimensionConstants' );
  const Property = require( 'AXON/Property' );

  const MAX_VISIBLE_MASSES = 10;
  const MAX_MASSES = MAX_VISIBLE_MASSES + 2; // tem as imoveis das pontas tb - Franco
  const MAX_SPRINGS = MAX_MASSES - 1;

  class OneDimensionModel  {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      // @public {Mass[]} Array that will contain all of the masses.
      this.masses = new Array( MAX_MASSES );
      this.initialMasses = new Array( MAX_MASSES ); // pra resetar quando aperta Initial Positions Franco
                                                    // TODO gravar essas posicoes qdo aperta play pela primeira vez e resetar qdo aperta zero positions
      // TODO - foreach = new MassNode... Franco

      // @public {Spring[]} Array that will contain all of the springs.
      this.springs = new Array( MAX_SPRINGS );

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

      this.modeAmplitudeProperty = new Array( MAX_VISIBLE_MASSES );
      this.modePhaseProperty = new Array( MAX_VISIBLE_MASSES );
      for(let i = 0; i < MAX_VISIBLE_MASSES; i++) {
        this.modeAmplitudeProperty[i] = new NumberProperty( OneDimensionConstants.INIT_MODE_AMPLITUDE, {
          tandem: tandem.createTandem( 'modeAmplitudeProperty' + i ),
          range: new Range( OneDimensionConstants.MIN_MODE_AMPLITUDE, Number.POSITIVE_INFINITY ) 
          // o slider da amplitude precisa ter um máximo, mas o valor da amplitude não pode - Thiago
        } );

        this.modePhaseProperty[i] = new NumberProperty( OneDimensionConstants.INIT_MODE_PHASE, {
          tandem: tandem.createTandem( 'modePhaseProperty' + i ),
          range: new Range( OneDimensionConstants.MIN_MODE_PHASE, OneDimensionConstants.MAX_MODE_PHASE )
        } );
        
      }
    }

    /**
     * Resets the normal modes' amplitude and phase.
     * @public
     */
    resetNormalModes() {
      for(let i = 0; i < MAX_VISIBLE_MASSES; i++) {
        this.modeAmplitudeProperty[i].reset(); // TODO ver range Franco
        this.modePhaseProperty[i].reset(); // -pi..pi Franco
      }
    }

    /**
     * Resets the model.
     * @public
     */
    reset() {
      this.playingProperty.reset();
      this.simSpeedProperty.reset();
      this.phasesVisibilityProperty.reset();
      this.springsVisibilityProperty.reset();
      this.numVisibleMassesProperty.reset();
      this.directionOfMotionProperty.reset();

      this.resetNormalModes();
    }

    /**
     * Returns masses to the initial position.
     * @public
     */
    initialPositions() {
      for(let i = 0; i < MAX_MASSES; i++) {
        this.masses[i] = this.initialMasses[i];
      }
        // TODO recalcular amplitudes e phases
    }

    /**
     * Zeroes the masses' positions.
     * @public
     */
    zeroPositions() {
      for(let i = 0; i < MAX_MASSES; i++) {
        this.masses[i].reset();
        this.initialMasses[i] = this.masses[i];
      }

      this.resetNormalModes();
    }

    /**
     * Steps the model.
     * @param {number} dt - time step, in seconds
     * @public
     */
    step( dt ) {
      //TODO
    }
  }

  return normalModes.register( 'OneDimensionModel', OneDimensionModel );
} );