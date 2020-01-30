// Copyright 2019, University of Colorado Boulder

/**
 * @author Thiago de Mendonça Mildemberger (UTFPR)
 * @author Franco Barpp Gomes (UTFPR)
 */
define( require => {
    'use strict';
  
    // modules
    const Property = require( 'AXON/Property' );
    const Screen = require( 'JOIST/Screen' );
    const normalModes = require( 'NORMAL_MODES/normalModes' );
    const TwoDimensionsModel = require( 'NORMAL_MODES/two-dimensions/model/TwoDimensionsModel' );
    const TwoDimensionsScreenView = require( 'NORMAL_MODES/two-dimensions/view/TwoDimensionsScreenView' );

    const screenTwoDimensionsString = require( 'string!NORMAL_MODES/screen.two-dimensions' );
  
    class TwoDimensionsScreen extends Screen {
  
      /**
       * @param {Tandem} tandem
       */
      constructor( tandem ) {
  
        const options = {
          name: screenTwoDimensionsString,
          backgroundColorProperty: new Property( 'white' ),
          tandem: tandem
        };
  
        super(
          () => new TwoDimensionsModel( tandem.createTandem( 'model' ) ),
          model => new TwoDimensionsScreenView( model, tandem.createTandem( 'view' ) ),
          options
        );
      }
    }
  
    return normalModes.register( 'TwoDimensionsScreen', TwoDimensionsScreen );
  } );