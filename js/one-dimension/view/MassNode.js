// Copyright 2019, University of Colorado Boulder

/**
 * @author Thiago de Mendonça Mildemberger (UTFPR)
 */
define( require => {
  'use strict';

  // modules

  const Color = require( 'SCENERY/util/Color' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const DragListener = require( 'SCENERY/listeners/DragListener' );
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
     * @param {boolean} oneDimension
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
      this.addChild( this.rect );

      Property.multilink( [ this.mass.equilibriumPositionProperty, this.mass.displacementProperty ], function( massPosition, massDisplacement ) {
        self.translation = self.modelViewTransform.modelToViewPosition( massPosition.plus( massDisplacement ) ).subtract( new Vector2( self.rect.rectWidth / 2, self.rect.rectHeight / 2 ) );
      } );
      
      if ( oneDimension ) {
        this.startCallback = function( event, listener ) {
          self.model.draggingMassIndexProperty.set( self.model.masses.indexOf( self.mass ) );
        };

        this.dragCallback = function( event, listener ) {
          // let point = .subtract( new Vector2( self.rect.rectWidth / 2, self.rect.rectHeight / 2 );
          console.log('model::'); console.log( listener.modelPoint );
          // console.log('local::'); console.log( listener.localPoint );
          // console.log('parent::'); console.log( self.modelViewTransform.viewToModelPosition( listener.parentPoint ) );
          let point = listener.modelPoint.minus( self.mass.equilibriumPositionProperty.get() );
          if ( self.model.directionOfMotionProperty.get() === self.model.directionOfMotion.HORIZONTAL ) {
            const oldY = self.mass.displacementProperty.get().y;
            self.mass.displacementProperty.set( new Vector2( point.x, oldY ) );
          } else {
            const oldX = self.mass.displacementProperty.get().x;
            self.mass.displacementProperty.set( new Vector2( oldX, point.y ) );
          }
        };

        this.endCallback =  function( event, listener ) {
          self.model.draggingMassIndexProperty.set( -1 );
          self.model.computeModeAmplitudesAndPhases();
        };
      }
      else {
        this.startCallback = function( event, listener ) {
          let foundIndex = -1;
          let foundArray = null;
          for ( let array of self.model.masses ) {
            foundIndex = array.indexOf( self.mass );
            if ( foundIndex != -1 ) {
              foundArray = array;
              break;
            }
          }
          self.model.draggingMassIndexesProperty.set( {
            i: self.model.masses.indexOf( foundArray ),
            j: foundIndex
          } );
        };

        this.dragCallback = function( event, listener ) {
          console.log('model::'); console.log( listener.modelPoint );
          self.mass.displacementProperty.set( listener.modelPoint.minus( self.mass.equilibriumPositionProperty.get() ) );
        };

        this.endCallback =  function( event, listener ) {
          self.model.draggingMassIndexesProperty.set( null );
          self.model.computeModeAmplitudesAndPhases();
        };
      }

      this.addInputListener( new DragListener( {
        applyOffset: false,
        start: this.startCallback,
        drag: this.dragCallback,
        end: this.endCallback,
        transform: self.modelViewTransform
      } ) );

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

  return normalModes.register( 'MassNode', MassNode );
} );