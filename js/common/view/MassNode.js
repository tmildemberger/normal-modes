// Copyright 2019, University of Colorado Boulder

/**
 * MassNode is a base class for MassNode1D and MassNode2D, as its drag listeners differ.
 * 
 * @author Thiago de Mendonça Mildemberger (UTFPR)
 * @author Franco Barpp Gomes (UTFPR)
 */
define( require => {
  'use strict';

  // modules

  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const Color = require( 'SCENERY/util/Color' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const Node = require( 'SCENERY/nodes/Node' );
  const normalModes = require( 'NORMAL_MODES/normalModes' );
  const Property = require( 'AXON/Property' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Vector2 = require( 'DOT/Vector2' );

  class MassNode extends Node {

    /**
     * @param {Mass} mass
     * @param {ModelViewTransform2} modelViewTransform
     * @param {OneDimensionModel} model
     * @param {Tandem} tandem
     */
    constructor( mass, modelViewTransform, model, oneDimension, tandem ) {
      super( { cursor: 'pointer' } );

      const self = this;
      
      // @private (read-only) Non-property attributes
      this.mass = mass;
      this.modelViewTransform = modelViewTransform;
      this.model = model;
    
      // @public {Property.<boolean>} determines the visibility of the MassNode
      this.visibilityProperty = new DerivedProperty ( [ this.mass.visibilityProperty ], function( massVisible ) {
        return massVisible;
      } );

      // @public {Rectangle}
      this.rect = new Rectangle( {
        fill: '#007bff',
        stroke: Color.toColor( '#007bff' ).colorUtilsDarker( .6 ),
        boundsMethod: 'unstroked',
        lineWidth: 4,
        rectWidth: 20,
        rectHeight: 20
      } );

      Property.multilink( [ this.mass.equilibriumPositionProperty, this.mass.displacementProperty ], function( massPosition, massDisplacement ) {
        self.translation = self.modelViewTransform.modelToViewPosition( massPosition.plus( massDisplacement ) ).subtract( new Vector2( self.rect.rectWidth / 2, self.rect.rectHeight / 2 ) );
      } );

      const arrowOptions = {
        fill: 'rgb(255,255,0)',
        stroke: Color.toColor( 'rgb(255,255,0)' ).colorUtilsDarker( .6 ),
        boundsMethod: 'unstroked',
        lineWidth: 2,
        tailWidth: 10,
        headWidth: 20,
        headHeight: 16,
        visible: false,
      };

      // @public {Object}
      this.arrows = {
        left: new ArrowNode( 
          this.rect.left,
          this.rect.centerY,
          this.rect.left - 23,
          this.rect.centerY, arrowOptions ),
        top: new ArrowNode( 
          this.rect.centerX,
          this.rect.top,
          this.rect.centerX,
          this.rect.top - 23, arrowOptions ),
        right: new ArrowNode( 
          this.rect.right,
          this.rect.centerY,
          this.rect.right + 23,
          this.rect.centerY, arrowOptions ),
        bottom: new ArrowNode( 
          this.rect.centerX,
          this.rect.bottom,
          this.rect.centerX,
          this.rect.bottom + 23, arrowOptions ),
      }

      this.addChild( this.arrows.left );
      this.addChild( this.arrows.top );
      this.addChild( this.arrows.right );
      this.addChild( this.arrows.bottom );
      this.addChild( this.rect );

    }

    /**
     * Resets the node.
     * @public
     */
    reset() {
      // TODO
    }
    
  }

  return normalModes.register( 'MassNode', MassNode );
} );