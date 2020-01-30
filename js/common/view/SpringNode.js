// Copyright 2019, University of Colorado Boulder

/**
 * @author Thiago de Mendonça Mildemberger (UTFPR)
 */
define( require => {
  'use strict';

  // modules

  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const Node = require( 'SCENERY/nodes/Node' );
  const normalModes = require( 'NORMAL_MODES/normalModes' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Property = require( 'AXON/Property' );
  const Shape = require( 'KITE/Shape' );

  class SpringNode extends Node {

    /**
     * @param {Spring} spring
     * @param {ModelViewTransform2} modelViewTransform
     * @param {OneDimensionModel} model
     * @param {Tandem} tandem
     */
    constructor( spring, modelViewTransform, model, tandem ) {
      super( {
        cursor: 'pointer',
        preventFit: true,
        boundsMethod: 'none',
        pickable: false,
        inputEnabled: false,
        excludeInvisible: true
      } );

      const self = this;

      // @private (read-only) Non-property attributes
      this.spring = spring;
      this.modelViewTransform = modelViewTransform;
      this.model = model;

      // @public {Property.<boolean>} determines the visibility of the SpringNode
      this.visibilityProperty = new DerivedProperty ( [ this.spring.visibilityProperty, this.model.springsVisibilityProperty ], function( mySpringVisible, springsVisible ) {
        return mySpringVisible && springsVisible;
      } );

      // @private {Shape} shape of the spring path
      this.springShape = new Shape().moveTo( 0, 0 ).lineTo( 1, 0 );
      
      // @private {Path} line path that represents a string
      this.line = new Path( this.springShape, {
        preventFit: true,
        boundsMethod: 'none',
        pickable: false,
        inputEnabled: false,
        stroke: 'red',
        lineWidth: 5
      } );
      this.addChild( this.line );

      let currentXScaling = 1;

      Property.multilink( [ this.spring.leftMass.equilibriumPositionProperty, this.spring.leftMass.displacementProperty, this.spring.rightMass.equilibriumPositionProperty, this.spring.rightMass.displacementProperty ], function( leftPos, leftDispl, rightPos, rightDispl ) {
        if ( self.visible ) {

          let p1 = self.modelViewTransform.modelToViewPosition( leftPos.plus( leftDispl ) );
          let p2 = self.modelViewTransform.modelToViewPosition( rightPos.plus( rightDispl ) );
          if ( p1.distance( p2 ) === 0 ) return;
          
          self.scale( 1 / currentXScaling, 1 );
          
          currentXScaling = p1.distance( p2 );

          self.translation = p1;
          self.rotation = p2.minus( p1 ).angle;
          self.scale( currentXScaling, 1 );
        }
      } );

      this.visibilityProperty.linkAttribute( this, 'visible' );
    }

    /**
     * Resets the node.
     * @public
     */
    reset() {
      // NO-OP
    }
    
  }

  return normalModes.register( 'SpringNode', SpringNode );
} );