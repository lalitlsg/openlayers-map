import React, { Component } from "react";

export default class Timeline extends Component {
  componentDidMount() {}

  infoTile = () => {
    const { locationPoints, currentCoords, locatePoint } = this.props;

    const updatedLocationPoints = [...locationPoints];
    updatedLocationPoints.forEach((v) => {
      v.currentCoords =
        v.coords[0] === currentCoords[0] && v.coords[1] === currentCoords[1];
    });

    const infoTileList = updatedLocationPoints.map((v, i) => {
      const tileInfoClasses = ["infoTile"];
      if (v.currentCoords) tileInfoClasses.push("currentActiveTile");
      return (
        <section
          key={v.id}
          className={tileInfoClasses.join(" ")}
          onMouseOver={() => locatePoint(v.coords)}
          onMouseOut={() => locatePoint([])}
        >
          <div>{v.coords.toString()}</div>
          <div>{v.address}</div>
          <div className="address">
            <span>{v.date}</span>
            <span>+{v.noOfDays - 1} days</span>
          </div>
        </section>
      );
    });
    return infoTileList;
  };

  render() {
    const { timelineRef } = this.props;
    return (
      <div ref={timelineRef} className="timeline">
        {this.infoTile()}
      </div>
    );
  }
}
