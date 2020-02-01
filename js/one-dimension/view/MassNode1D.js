// Copyright 2019, University of Colorado Boulder

/**
 * @author Thiago de Mendonça Mildemberger (UTFPR)
 * @author Franco Barpp Gomes (UTFPR)
 */
define( require => {
  'use strict';

  // modules

  const Color = require( 'SCENERY/util/Color' );
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const MassNode = require( 'NORMAL_MODES/common/view/MassNode' );
  const normalModes = require( 'NORMAL_MODES/normalModes' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Vector2 = require( 'DOT/Vector2' );

  class MassNode1D extends MassNode {

    /**
     * @param {Mass} mass
     * @param {ModelViewTransform2} modelViewTransform
     * @param {OneDimensionModel} model
     * @param {Tandem} tandem
     */
    constructor( mass, modelViewTransform, model, tandem ) {

      super( mass, modelViewTransform, model, tandem );
      const self = this;

      // @public {Rectangle}
      this.rect = new Rectangle( {
        fill: '#007bff',
        stroke: Color.toColor( '#007bff' ).colorUtilsDarker( .6 ),
        boundsMethod: 'unstroked',
        lineWidth: 4,
        rectWidth: this.size,
        rectHeight: this.size,
        centerX: 0,
        centerY: 0
      } );

      this.addChild( this.rect );

      this.startCallback = function( event, listener ) {
        self.model.draggingMassIndexProperty.set( self.model.masses.indexOf( self.mass ) );
      };

      this.dragCallback = function( event, listener ) {
        self.model.arrowsVisibilityProperty.set( false );
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

      this.overUpCallback = function( isOver ) {
        const axis = self.model.directionOfMotionProperty.get();
        if( axis == self.model.directionOfMotion.VERTICAL ) {
          self.arrows.top.visible = isOver;
          self.arrows.bottom.visible = isOver;
        }
        else {
          self.arrows.left.visible = isOver;
          self.arrows.right.visible = isOver;
        }
      };

      this.dragListener = new DragListener( {
        applyOffset: true,
        start: this.startCallback,
        drag: this.dragCallback,
        end: this.endCallback,
        transform: self.modelViewTransform
      } );

      this.addInputListener( this.dragListener );
      this.model.arrowsVisibilityProperty.link( function( arrowsVisible ) {
        let callback = self.overUpCallback.bind( self );
        if ( arrowsVisible ) {
          self.dragListener.isOverProperty.link( callback );
        }
        else {
          self.arrows.top.visible = false;
          self.arrows.bottom.visible = false;
          self.arrows.left.visible = false;
          self.arrows.right.visible = false;
          self.dragListener.isOverProperty.unlink( callback );
        }
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

  return normalModes.register( 'MassNode1D', MassNode1D );
} );