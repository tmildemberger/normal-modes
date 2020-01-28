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

      this.size = 20;
    
      // @public {Property.<boolean>} determines the visibility of the MassNode
      this.visibilityProperty = new DerivedProperty ( [ this.mass.visibilityProperty ], function( massVisible ) {
        return massVisible;
      } );

      Property.multilink( [ this.mass.equilibriumPositionProperty, this.mass.displacementProperty ], function( massPosition, massDisplacement ) {
        self.translation = self.modelViewTransform.modelToViewPosition( massPosition.plus( massDisplacement ) );
        // self.translation = self.modelViewTransform.modelToViewPosition( massPosition.plus( massDisplacement ) ).subtract( new Vector2( self.rect.rectWidth / 2, self.rect.rectHeight / 2 ) );
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

      const arrowSize = 23;
      // @public {Object}
      this.arrows = {
        left: new ArrowNode( 
          - this.size / 2,
          0,
          - this.size / 2 - arrowSize,
          0, arrowOptions ),
        top: new ArrowNode( 
          0,
          - this.size / 2,
          0,
          - this.size / 2 - arrowSize, arrowOptions ),
        right: new ArrowNode( 
          this.size / 2,
          0,
          this.size / 2 + arrowSize,
          0, arrowOptions ),
        bottom: new ArrowNode( 
          0,
          this.size / 2,
          0,
          this.size / 2 + arrowSize, arrowOptions ),
      }

      this.addChild( this.arrows.left );
      this.addChild( this.arrows.top );
      this.addChild( this.arrows.right );
      this.addChild( this.arrows.bottom );
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