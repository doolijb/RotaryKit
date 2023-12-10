<script lang="ts">
	import { page } from "$app/stores"
	import { faker } from "@faker-js/faker"
	import Icon from "@iconify/svelte"
	import moment from "moment"
	import Chart from "@edde746/svelte-apexcharts"
	import { onMount } from "svelte"
	import { browser } from "$app/environment"
</script>



<!-- Fancy message of the day block -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
	<div class="card p-4">
		<span class="h3">
			Welcome back, {$page.data.user.username}
		</span>
	</div>
	<div class="card p-4">
		<span class="h3"> Message of the day </span>
		<p class="mt-4">
			This is a placeholder home page for the admin dashboard.
		</p>
	</div>
	<div class="card p-4 overflow-hidden">
			<Chart
			  options={{
				chart: {
				  type: "bar",
				  height: 333,
				},
				title: {
				text: "Monthly Shipments",
				align: "left"
			  },
				series: [
				  {
					name: "sales",
					data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
				  },
				],
				xaxis: {
				  categories: ["January", "February", "March", "April", "May", "June", "July", "August", "September"],
				},
			  }}
			/>
	</div>
	<div class="card p-4 overflow-hidden">
			<Chart
			  options={{
				series: [
					{
				  name: "Unique Visitors",
				  data: [10, 41, 35, 51, 49, 62, 91]
			  },
			  {
				  name: "Page Visits",
				  data: [20, 51, 47, 100, 60, 86, 145]
			  }
			],
				chart: {
				height: 350,
				type: "line",
				zoom: {
				  enabled: false
				}
			  },
			  dataLabels: {
				enabled: false
			  },
			  stroke: {
				curve: "smooth"
			  },
			  title: {
				text: "Daily Visitors",
				align: "left"
			  },
			  grid: {
				row: {
				  colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
				  opacity: 0.5
				},
			  },
			  xaxis: {
				categories: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
			  }
			  }}
			/>
		  </div>
</div>

<!-- Fancy admin log placeholder -->
<div class="card p-4 mb-5">
	<span class="h3"> Admin Log </span>
	<table class="table mt-4">
		<thead>
			<tr>
				<th>Time</th>
				<th>User</th>
				<th>Message</th>
			</tr>
		</thead>
		<tbody>
			<!-- Use faker -->
			{#each Array(5) as _}
				<tr>
					<td>{moment(faker.date.recent()).toLocaleString()}</td>
					<td>{faker.internet.userName()}</td>
					<td>{faker.lorem.sentence()}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<!-- Open tickets placeholder -->
<div class="card p-4 mb-5">
	<span class="h3"> Open Tickets </span>
	<table class="table mt-4">
		<thead>
			<tr>
				<th>Time</th>
				<th>Status</th>
				<th>Subject</th>
				<th>User</th>
				<th>
					<Icon class="h-7 w-7" icon="mdi:comment-text-multiple-outline" />
				</th>
			</tr>
		</thead>
		<tbody>
			<!-- Use faker -->
			{#each Array(5) as _}
				<tr>
					<td>{moment(faker.date.recent()).toLocaleString()}</td>
					<td>{faker.lorem.word()}</td>
					<td>{faker.lorem.word()}</td>
					<td>{faker.internet.userName()}</td>
					<td style="padding: 0 !important"
						><button class="btn btn-sm variant-filled mb-0 mt-3">View</button></td
					>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
