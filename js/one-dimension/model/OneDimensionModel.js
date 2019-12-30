// Copyright 2019, University of Colorado Boulder

/**
 * @author UTFPR
 */
define( require => {
  'use strict';

  // modules
  const Property = require( 'AXON/Property' );
  const normalModes = require( 'NORMAL_MODES/normalModes' );

  const MAX_VISIBLE_MASSES = 10;
  const MAX_MASSES = MAX_VISIBLE_MASSES + 2; // tem as imoveis das pontas tb - Franco

  /**
   * @constructor
   */
  class OneDimensionModel  {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {
      this.masses = new Array( MAX_MASSES );
      this.initialMasses = new Array( MAX_MASSES ); // pra resetar quando aperta Initial Positions Franco
                                                    // TODO gravar essas posicoes qdo aperta play pela primeira vez e resetar qdo aperta zero positions
      // TODO - foreach = new MassNode... Franco

      this.playProperty = new Property( true ); // play/pause state
      this.speedProperty = new Property( 1.0 ); // TODO ver range Franco
      this.showPhasesProperty = new Property( true );
      this.showSpringsProperty = new Property( true );
      this.numVisibleMassesProperty = new Property( 3 );
      this.polarizationControlProperty = new Property( 'h' ); // 'h' ou 'v' (horizontal ou vertical) Franco

      this.modeAmplitudeProperty = new Array( MAX_VISIBLE_MASSES );
      this.modePhaseProperty = new Array( MAX_VISIBLE_MASSES );
      for(let i = 0; i < MAX_VISIBLE_MASSES; i++) {
        this.modeAmplitudeProperty[i] = new Property( 0 ); // TODO ver range Franco
        this.modePhaseProperty[i] = new Property( 0 ); // -pi..pi Franco
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
      this.playProperty.reset();
      this.speedProperty.reset();
      this.showPhasesProperty.reset();
      this.showSpringsProperty.reset();
      this.numVisibleMassesProperty.reset();
      this.polarizationControlProperty.reset();

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