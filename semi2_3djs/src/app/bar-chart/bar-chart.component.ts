import { AfterViewInit,Component,Input,OnInit } from "@angular/core";
import * as d3 from 'd3';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit, AfterViewInit {
  @Input("barData") private data: any[];
  @Input("title") public title;
  private highestValue: string;
  private svg;
  private margin = 100;
  private width = 750 - this.margin * 2;
  private height = 600 - this.margin * 2;
  constructor() {}

  ngOnInit(): void {
    // determining highest value
    let highestCurrentValue = 0;
    let tableLength = this.data.length;
    this.data.forEach((data, i) => {
      const barValue = Number(data.value);
      if (barValue > highestCurrentValue) {
        highestCurrentValue = barValue;
      }
      if (tableLength == i + 1) {
        this.highestValue = highestCurrentValue.toString();
      }
    });
  }

  ngAfterViewInit(): void {
    this.createSvg();
    this.drawBars(this.data);
  }

  private createSvg(): void {
    this.svg = this.d3.d3
      .select("div#chart")
      .append("svg")
      .attr(
        "viewBox",
        `0 0 ${this.width + this.margin * 2} ${this.height + this.margin * 2}`
      )

      .append("g")
      .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
  }

  private drawBars(data: any[]): void {
    // Creating X-axis band scale
    const x = this.d3.d3
      .scaleBand()
      .range([0, this.width])
      .domain(data.map(d => d.name))
      .padding(0.2);

    // Drawing X-axis on the DOM
    this.svg
      .append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(this.d3.d3.axisBottom(x))
      .selectAll("text")
      // .attr('transform', 'translate(-10, 0)rotate(-45)')
      // .style('text-anchor', 'end')
      .style("font-size", "14px");

    // Creaate Y-axis band scale
    const y = this.d3.d3
      .scaleLinear()
      .domain([0, Number(this.highestValue) + 50])
      .range([this.height, 0]);

    // Draw the Y-axis on the DOM
    this.svg
      .append("g")
      .call(this.d3.d3.axisLeft(y))
      .selectAll("text")
      .style("font-size", "14px");

    // Create and fill the bars
    this.svg
      .selectAll("bars")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => x(d.name))
      .attr("y", d => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", d =>
        y(d.value) < this.height ? this.height - y(d.value) : this.height
      ) // this.height
      .attr("fill", d => d.color);

    this.svg
      .selectAll("text.bar")
      .data(data)
      .enter()
      .append("text")
      .attr("text-anchor", "middle")
      .attr("fill", "#70747a")
      .attr("x", d => x(d.name) + 18)
      .attr("y", d => y(d.value) - 5)
      .text(d => Math.round(d.value * 100) / 100);
  }
}
