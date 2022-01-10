import React from "react";
function Error() {
  return (
<main className="main">
		<div className="container">
			<div className="row row--grid">
				<div className="col-12">
					<ul className="breadcrumb">
						<li className="breadcrumb__item"><a href="/">Home</a></li>
						<li className="breadcrumb__item breadcrumb__item--active">Error 404</li>
					</ul>
				</div>
				<div className="col-12">
					<div className="page-404">
						<div className="page-404__wrap">
							<div className="page-404__content">
								<h1 className="page-404__title">404</h1>
								<p className="page-404__text">The page you are looking for not available!</p>
								<a href="/" className="page-404__btn">go back</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</main>);
}
export default Error;