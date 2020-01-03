// Copyright 2019, University of Colorado Boulder

/**
 * @author UTFPR
 */
define( require => {
  'use strict';

  // modules
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const normalModes = require( 'NORMAL_MODES/normalModes' );
  const OneDimensionConstants = require( 'NORMAL_MODES/one-dimension/OneDimensionConstants' );
  const NormalModesConstants = require( 'NORMAL_MODES/common/NormalModesConstants' );

  const OptionsPanel = require( 'NORMAL_MODES/common/OptionsPanel' );
  const AmpPhasePanel = require( 'NORMAL_MODES/one-dimension/view/AmpPhasePanel' );

  class OneDimensionScreenView extends ScreenView {

    /**
     * @param {OneDimensionModel} model
     * @param {Tandem} tandem
     */
    constructor( model, tandem ) {

      super( {
        tandem: tandem
      } );

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

      const ampPhasePanelOptions = {
        bottom: this.layoutBounds.maxY - OneDimensionConstants.SCREEN_VIEW_Y_MARGIN,
        cornerRadius: 5,
        fill: 'rgb( 254, 235, 214 )',
        xMargin: 10,
        yMargin: 10,
        maxWidth: 680,
        minWidth: 680
      };

      const ampPhasePanel = new AmpPhasePanel(
        ampPhasePanelOptions,
        model,
        this.layoutBounds
      );

      this.addChild( ampPhasePanel );
      this.addChild( optionsPanel );
      this.addChild( resetAllButton );
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