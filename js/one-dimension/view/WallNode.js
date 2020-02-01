// Copyright 2019-2020, University of Colorado Boulder

/**
 * @author Thiago de Mendonça Mildemberger (UTFPR)
 */
define( require => {
  'use strict';

  // modules

  const Color = require( 'SCENERY/util/Color' );
  const Node = require( 'SCENERY/nodes/Node' );
  const normalModes = require( 'NORMAL_MODES/normalModes' );
  const Property = require( 'AXON/Property' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Vector2 = require( 'DOT/Vector2' );

  class WallNode extends Node {

    /**
     * @param {Mass} mass
     * @param {ModelViewTransform2} modelViewTransform
     * @param {OneDimensionModel} model
     * @param {Tandem} tandem
     */
    constructor( mass, modelViewTransform, model, tandem ) {
      super( { cursor: 'pointer' } );

      const self = this;
      
      // @private (read-only) Non-property attributes
      this.mass = mass;
      this.modelViewTransform = modelViewTransform;
      this.model = model;

      // @public {Rectangle}
      this.rect = new Rectangle( {
        fill: '#333',
        stroke: Color.toColor( '#333' ).colorUtilsDarker( .5 ),
        boundsMethod: 'unstroked',
        lineWidth: 2,
        rectWidth: 6,
        rectHeight: 80,
        cornerRadius: 2
      } );
      this.addChild( this.rect );

      Property.multilink( [ this.mass.equilibriumPositionProperty, this.mass.displacementProperty ], function( massPosition, massDisplacement ) {
        self.translation = self.modelViewTransform.modelToViewPosition( massPosition.plus( massDisplacement ) ).subtract( new Vector2( self.rect.rectWidth / 2, self.rect.rectHeight / 2 ) );
      } );

    }

    /**
     * Resets the node.
     * @public
     */
    reset() {
      // NO-OP
    }
    
  }

  return normalModes.register( 'WallNode', WallNode );
} );