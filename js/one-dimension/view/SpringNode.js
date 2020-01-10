// Copyright 2019, University of Colorado Boulder

/**
 * @author Thiago de Mendonça Mildemberger (UTFPR)
 */
define( require => {
  'use strict';

  // modules

  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Node = require( 'SCENERY/nodes/Node' );
  const normalModes = require( 'NORMAL_MODES/normalModes' );
  const Property = require( 'AXON/Property' );

  class SpringNode extends Node {

    /**
     * @param {Spring} spring
     * @param {ModelViewTransform2} modelViewTransform
     * @param {OneDimensionModel} model
     * @param {Tandem} tandem
     */
    constructor( spring, modelViewTransform, model, tandem ) {
      super( { cursor: 'pointer' } );

      const self = this;

      // @private (read-only) Non-property attributes
      this.spring = spring;
      this.modelViewTransform = modelViewTransform;
      this.model = model;
    
      // @public {Property.<boolean>} determines the visibility of the SpringNode
      this.visibilityProperty = new DerivedProperty ( [ this.spring.visibilityProperty, this.model.springsVisibilityProperty ], function( mySpringVisible, springsVisible ) {
        return mySpringVisible && springsVisible;
      } );
      
      // @public {Rectangle}
      this.line = new Line( {
        stroke: 'yellow',
        lineWidth: 4
      } );

      // self.rect.rectBounds = new Bounds2(
      //   modelViewTransform2.modelToViewDeltaX( -radiusValue ),
      //   hookHeight,
      //   modelViewTransform2.modelToViewDeltaX( radiusValue ),
      //   modelViewTransform2.modelToViewDeltaY( -mass.cylinderHeightProperty.get() ) + hookHeight );
      this.addChild( this.line );

      Property.multilink( [ this.spring.leftMass.equilibriumPositionProperty, this.spring.leftMass.displacementProperty, this.spring.rightMass.equilibriumPositionProperty, this.spring.rightMass.displacementProperty ], function( leftPos, leftDispl, rightPos, rightDispl ) {
      // this.spring.leftMass.equilibriumPositionProperty.link( function( position ) {
        // self.translation = self.modelViewTransform.modelToViewPosition( position.plus( self.spring.leftMass.displacementProperty.get() ) );
        let p1 = self.modelViewTransform.modelToViewPosition( leftPos.plus( leftDispl ) );
        let p2 = self.modelViewTransform.modelToViewPosition( rightPos.plus( rightDispl ) );
        self.line.setLine( p1.x, p1.y, p2.x, p2.y );
      } );

      this.visibilityProperty.linkAttribute( this, 'visible' );
    }

    /**
     * Resets the node.
     * @public
     */
    reset() {
      // TODO
    }
    
  }

  return normalModes.register( 'SpringNode', SpringNode );
} );