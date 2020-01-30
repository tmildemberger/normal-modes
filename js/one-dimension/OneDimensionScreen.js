// Copyright 2019, University of Colorado Boulder

/**
 * @author Franco Barpp Gomes (UTFPR)
 * @author Thiago de Mendonça Mildemberger (UTFPR)
 */
define( require => {
    'use strict';
  
    // modules
    const Property = require( 'AXON/Property' );
    const Screen = require( 'JOIST/Screen' );
    const normalModes = require( 'NORMAL_MODES/normalModes' );
    const OneDimensionModel = require( 'NORMAL_MODES/one-dimension/model/OneDimensionModel' );
    const OneDimensionScreenView = require( 'NORMAL_MODES/one-dimension/view/OneDimensionScreenView' );

    const screenOneDimensionString = require( 'string!NORMAL_MODES/screen.one-dimension' );
  
    class OneDimensionScreen extends Screen {
  
      /**
       * @param {Tandem} tandem
       */
      constructor( tandem ) {
  
        const options = {
          name: screenOneDimensionString,
          backgroundColorProperty: new Property( 'white' ),
          tandem: tandem
        };
  
        super(
          () => new OneDimensionModel( tandem.createTandem( 'model' ) ),
          model => new OneDimensionScreenView( model, tandem.createTandem( 'view' ) ),
          options
        );
      }
    }
  
    return normalModes.register( 'OneDimensionScreen', OneDimensionScreen );
  } );