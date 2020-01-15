// Copyright 2019, University of Colorado Boulder

/**
 * @author UTFPR
 */
define( require => {
  'use strict';

  // modules
  const AmpSelectorAccordionBox = require( 'NORMAL_MODES/two-dimensions/view/AmpSelectorAccordionBox' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const Color = require( 'SCENERY/util/Color' );
  const MassNode = require( 'NORMAL_MODES/common/view/MassNode' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const normalModes = require( 'NORMAL_MODES/normalModes' );
  const OptionsPanel = require( 'NORMAL_MODES/common/OptionsPanel' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const SpringNode = require( 'NORMAL_MODES/common/view/SpringNode' );
  const TwoDimensionsConstants = require( 'NORMAL_MODES/two-dimensions/TwoDimensionsConstants' );
  const Vector2 = require( 'DOT/Vector2' );

  class TwoDimensionsScreenView extends ScreenView {

    /**
     * @param {TwoDimensionsModel} model
     * @param {Tandem} tandem
     */
    constructor( model, tandem ) {

      super( {
        tandem: tandem
      } );

      const self = this;

      // @public {OneDimensionModel}
      this.model = model;

      const viewOrigin = new Vector2( ( this.layoutBounds.maxX - 2 * TwoDimensionsConstants.SCREEN_VIEW_X_MARGIN - 420 ) / 2 + 2 * TwoDimensionsConstants.SCREEN_VIEW_X_MARGIN,
                                      ( this.layoutBounds.maxY - 2 * TwoDimensionsConstants.SCREEN_VIEW_Y_MARGIN - 0 ) / 2 + TwoDimensionsConstants.SCREEN_VIEW_Y_MARGIN);

      // @public {ModelViewTransform2}
      this.modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping( Vector2.ZERO, viewOrigin, ( this.layoutBounds.maxX - 2 * TwoDimensionsConstants.SCREEN_VIEW_X_MARGIN - 420 ) / 2 );

      const resetAllButton = new ResetAllButton( {
        listener: () => {
          this.interruptSubtreeInput(); // cancel interactions that may be in progress
          model.reset();
          this.reset();
        },
        right: this.layoutBounds.maxX - TwoDimensionsConstants.SCREEN_VIEW_X_MARGIN,
        bottom: this.layoutBounds.maxY - TwoDimensionsConstants.SCREEN_VIEW_Y_MARGIN,
        tandem: tandem.createTandem( 'resetAllButton' )
      } );

      const optionsPanelOptions = {
        right: this.layoutBounds.maxX - TwoDimensionsConstants.SCREEN_VIEW_X_MARGIN,
        top: TwoDimensionsConstants.SCREEN_VIEW_Y_MARGIN,
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
        false /* showPhases checkbox */
      );

      this.addChild( optionsPanel );
      this.addChild( resetAllButton );

      const ampSelectorAccordionBoxOptions = {
        // left: 2 * OneDimensionConstants.SCREEN_VIEW_X_MARGIN,
        right: this.layoutBounds.maxX - TwoDimensionsConstants.SCREEN_VIEW_X_MARGIN,
        bottom: this.layoutBounds.maxY - TwoDimensionsConstants.SCREEN_VIEW_Y_MARGIN,
        cornerRadius: 5,
        fill: 'rgb( 254, 235, 214 )',
        minWidth: 200,
        selectorWidth: 290,
      };

      const ampSelectorAccordionBox = new AmpSelectorAccordionBox( ampSelectorAccordionBoxOptions, model );

      this.addChild( ampSelectorAccordionBox );

      // @private {SpringNode[]} Array that will contain all of the springNodes.
      this.springXNodes = model.springsX.map( function( springArray ) {
        return springArray.map( function( spring ) {
          const springNode = new SpringNode( spring, self.modelViewTransform, self.model, tandem.createTandem( 'springNodes' ) );
          self.addChild( springNode );
          return springNode;
        } );
      } );
      
      this.springYNodes = model.springsY.map( function( springArray ) {
        return springArray.map( function( spring ) {
          const springNode = new SpringNode( spring, self.modelViewTransform, self.model, tandem.createTandem( 'springNodes' ) );
          self.addChild( springNode );
          return springNode;
        } );
      } );

      // The springs are added first
      const topLeftPoint = this.modelViewTransform.modelToViewPosition( new Vector2( -1, 1 ) );
      const bottomRightPoint = this.modelViewTransform.modelToViewPosition( new Vector2( 1, -1 ) );

      const borderWalls = new Rectangle( new Bounds2( topLeftPoint.x, topLeftPoint.y, bottomRightPoint.x, bottomRightPoint.y ), {
        stroke: Color.toColor( '#333' ),
        lineWidth: 2,
      } );

      this.addChild( borderWalls );
      // this.leftWallNode = new WallNode( this.model.masses[ 0 ], this.modelViewTransform, this.model, tandem.createTandem( 'leftWallNode' ) );
      // this.rightWallNode = new WallNode( this.model.masses[ this.model.masses.length - 1 ], this.modelViewTransform, this.model, tandem.createTandem( 'rightWallNode' ) );

      // this.addChild( this.leftWallNode );
      // this.addChild( this.rightWallNode );

      // @private {MassNode[]} Array that will contain all of the massNodes.
      this.massNodes = [];
      for ( let i = 1; i < this.model.masses.length - 1; ++i ) {
        for ( let j = 1; j < this.model.masses[ i ].length - 1; ++j ) {
          this.massNodes.push( new MassNode( this.model.masses[ i ][ j ], this.modelViewTransform, this.model, false, tandem.createTandem( 'massNodes' ) ) );
          this.addChild( this.massNodes[ this.massNodes.length - 1 ] );
        }
      }
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

  return normalModes.register( 'TwoDimensionsScreenView', TwoDimensionsScreenView );
} );