// Copyright 2019, University of Colorado Boulder

/**
 * @author UTFPR
 */
define( require => {
  'use strict';

  // modules
  const AmpPhasePanel = require( 'NORMAL_MODES/one-dimension/view/AmpPhasePanel' );
  const MassNode = require( 'NORMAL_MODES/one-dimension/view/MassNode' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const normalModes = require( 'NORMAL_MODES/normalModes' );
  const NormalModesConstants = require( 'NORMAL_MODES/common/NormalModesConstants' );
  const OneDimensionConstants = require( 'NORMAL_MODES/one-dimension/OneDimensionConstants' );
  const OptionsPanel = require( 'NORMAL_MODES/common/OptionsPanel' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const SpringNode = require( 'NORMAL_MODES/one-dimension/view/SpringNode' );
  const Vector2 = require( 'DOT/Vector2' );
  const WallNode = require( 'NORMAL_MODES/one-dimension/view/WallNode' );

  class OneDimensionScreenView extends ScreenView {

    /**
     * @param {OneDimensionModel} model
     * @param {Tandem} tandem
     */
    constructor( model, tandem ) {

      super( {
        tandem: tandem
      } );

      const self = this;

      // @public {OneDimensionModel}
      this.model = model;

      const viewOrigin = new Vector2( ( this.layoutBounds.maxX - 2 * OneDimensionConstants.SCREEN_VIEW_X_MARGIN - 240 ) / 2 + 2 * OneDimensionConstants.SCREEN_VIEW_X_MARGIN,
                                      ( this.layoutBounds.maxY - 2 * OneDimensionConstants.SCREEN_VIEW_Y_MARGIN - 300 ) / 2 + OneDimensionConstants.SCREEN_VIEW_Y_MARGIN);

      // @public {ModelViewTransform2}
      this.modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping( Vector2.ZERO, viewOrigin, ( this.layoutBounds.maxX - 2 * OneDimensionConstants.SCREEN_VIEW_X_MARGIN - 240 ) / 2 );

      const resetAllButton = new ResetAllButton( {
        listener: () => {
          this.interruptSubtreeInput(); // cancel interactions that may be in progress
          model.reset();
          this.reset();
        },
        right: this.layoutBounds.maxX - OneDimensionConstants.SCREEN_VIEW_X_MARGIN,
        bottom: this.layoutBounds.maxY - OneDimensionConstants.SCREEN_VIEW_Y_MARGIN,
        tandem: tandem.createTandem( 'resetAllButton' )
      } );

      const optionsPanelOptions = {
        right: this.layoutBounds.maxX - OneDimensionConstants.SCREEN_VIEW_X_MARGIN,
        top: OneDimensionConstants.SCREEN_VIEW_Y_MARGIN,
        cornerRadius: 5,
        fill: 'rgb( 254, 235, 214 )',
        xMargin: 10,
        yMargin: 10,
        maxWidth: 180,
        minWidth: 180
      };

      const optionsPanel = new OptionsPanel(
        optionsPanelOptions,
        model,
        true /* showPhases checkbox */
      );

      // left: OneDimensionConstants.SCREEN_VIEW_X_MARGIN,
      const ampPhasePanelOptions = {
        left: 2 * OneDimensionConstants.SCREEN_VIEW_X_MARGIN,
        bottom: this.layoutBounds.maxY - OneDimensionConstants.SCREEN_VIEW_Y_MARGIN,
        cornerRadius: 5,
        fill: 'rgb( 254, 235, 214 )',
        xMargin: 10,
        yMargin: 10,
        maxWidth: this.layoutBounds.maxX - 2 * OneDimensionConstants.SCREEN_VIEW_X_MARGIN - 240,
        centerX: ( this.layoutBounds.maxX - 2 * OneDimensionConstants.SCREEN_VIEW_X_MARGIN - 240 ) / 2 + 2 * OneDimensionConstants.SCREEN_VIEW_X_MARGIN,
      };

      const ampPhasePanel = new AmpPhasePanel(
        ampPhasePanelOptions,
        model
      );
      
      this.addChild( ampPhasePanel );
      this.addChild( optionsPanel );
      this.addChild( resetAllButton );

      // @private {SpringNode[]} Array that will contain all of the springNodes.
      this.springNodes = model.springs.map( function( spring ) {
        const springNode = new SpringNode( spring, self.modelViewTransform, self.model, tandem.createTandem( 'springNodes' ) );
        self.addChild( springNode );
        return springNode;
      } );

      // The springs are added first

      this.leftWallNode = new WallNode( this.model.masses[ 0 ], this.modelViewTransform, this.model, tandem.createTandem( 'leftWallNode' ) );
      this.rightWallNode = new WallNode( this.model.masses[ this.model.masses.length - 1 ], this.modelViewTransform, this.model, tandem.createTandem( 'rightWallNode' ) );

      this.addChild( this.leftWallNode );
      this.addChild( this.rightWallNode );

      // @private {MassNode[]} Array that will contain all of the massNodes.
      this.massNodes = [];
      for ( let i = 1; i < this.model.masses.length - 1; ++i ) {
        this.massNodes.push( new MassNode( this.model.masses[ i ], this.modelViewTransform, this.model, tandem.createTandem( 'massNodes' ) ) );
        this.addChild( this.massNodes[ this.massNodes.length - 1 ] );
      }
      // this.massNodes = model.masses.map( function( mass ) {
      //   const massNode = new MassNode( mass, self.modelViewTransform, self.model, tandem.createTandem( 'massNodes' ) );
      //   self.addChild( massNode );
      //   return massNode;
      // } );
    }
    /**
     * Resets the view.
     * @public
     */
    reset() {
      //TODO
    }

    /**
     * Steps the view.
     * @param {number} dt - time step, in seconds
     * @public
     */
    step( dt ) {
      //TODO
    }
  }

  return normalModes.register( 'OneDimensionScreenView', OneDimensionScreenView );
} );