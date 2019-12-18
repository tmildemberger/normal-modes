// Copyright 2019, University of Colorado Boulder

/**
 * @author UTFPR
 */
define( require => {
  'use strict';

  // modules
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );
  const normalModes = require( 'NORMAL_MODES/normalModes' );
  const NormalModesModel = require( 'NORMAL_MODES/normal-modes/model/NormalModesModel' );
  const NormalModesScreenView = require( 'NORMAL_MODES/normal-modes/view/NormalModesScreenView' );

  class NormalModesScreen extends Screen {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      const options = {
        backgroundColorProperty: new Property( 'white' ),
        tandem: tandem
      };

      super(
        () => new NormalModesModel( tandem.createTandem( 'model' ) ),
        model => new NormalModesScreenView( model, tandem.createTandem( 'view' ) ),
        options
      );
    }
  }

  return normalModes.register( 'NormalModesScreen', NormalModesScreen );
} );