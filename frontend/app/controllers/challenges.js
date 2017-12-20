import Ember from 'ember';
import config from './../config/environment';

export default Ember.Controller.extend({
	serverURL: config.serverPath,
	rootUrl: config.rootURL,
	// queryParams: [
	// 	'page',
	// ],
	// page: 1,
	perPage: 4,
	actions: {
		// nextPage() {
    //
		// 	let page = this.get('page');
    //
		// 	this.set('page', page + 1);
		// },
		// prevPage() {
		// 	let page = this.get('page');
		// 	this.set('page', page - 1);
		// }
		loadMore() {
			// Load more challenges beyond those currently loaded
			let count = this.get('model.articles').length;
			let page = Math.floor((count-1)/this.get('perPage')) + 1;
			let url = config.serverPath + 'articles/?tag=Challenge&per_page='+this.get('perPage')+'&page='+(page+1);
			if (this.get('model.pagination')[0].total_pages > page) {
				return Ember.$.ajax({
					method: 'GET',
					url: url,
				}).then((result) => {
					this.set('model.pagination', result.pagination);
					this.get('model.articles').pushObjects(result.result)
				});
			}
		}
	}
});
