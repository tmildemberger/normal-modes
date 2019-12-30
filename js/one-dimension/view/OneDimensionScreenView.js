// Copyright 2019, University of Colorado Boulder

/**
 * @author UTFPR
 */
define( require => {
  'use strict';

  // modules
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const normalModes = require( 'NORMAL_MODES/normalModes' );
  const OneDimensionConstants = require( 'NORMAL_MODES/one-dimension/OneDimensionConstants' );
  const NormalModesConstants = require( 'NORMAL_MODES/common/NormalModesConstants' );

  class OneDimensionScreenView extends ScreenView {

    /**
     * @param {OneDimensionModel} model
     * @param {Tandem} tandem
     */
    constructor( model, tandem ) {

      super( {
        tandem: tandem
      } );

      const centerControlX = NormalModesConstants.viewSize.width / 2;
      const centerControlY = NormalModesConstants.viewSize.height - 131;

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

      const playPauseButtonOptions = {
        upFill: NormalModesConstants.blueUpColor,
        overFill: NormalModesConstants.blueOverColor,
        disabledFill: NormalModesConstants.blueDisabledColor,
        downFill: NormalModesConstants.blueDownColor,
        backgroundGradientColorStop0: NormalModesConstants.buttonBorder0,
        backgroundGradientColorStop1: NormalModesConstants.buttonBorder1,
        innerButtonLineWidth: 1
      };
      const playPauseButton = new PlayPauseButton( model.playProperty, {
        x: centerControlX + 45,
        centerY: centerControlY,
        scale: 0.6,
        scaleFactorWhenPaused: 1.25,
        touchAreaDilation: 12,
        pauseOptions: playPauseButtonOptions,
        playOptions: playPauseButtonOptions
      } );


      this.addChild( playPauseButton );
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