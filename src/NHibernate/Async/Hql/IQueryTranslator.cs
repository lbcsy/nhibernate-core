﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by AsyncGenerator.
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------


using System.Collections;
using System.Collections.Generic;
using NHibernate.Engine;
using NHibernate.Engine.Query;
using NHibernate.Event;
using NHibernate.Type;

namespace NHibernate.Hql
{
	using System.Threading.Tasks;
	using System.Threading;
	public partial interface IQueryTranslator
	{

		/// <summary>
		/// Perform a list operation given the underlying query definition.
		/// </summary>
		/// <param name="session">The session owning this query.</param>
		/// <param name="queryParameters">The query bind parameters.</param>
		/// <param name="cancellationToken">A cancellation token that can be used to cancel the work</param>
		/// <returns>The query list results.</returns>
		/// <exception cref="NHibernate.HibernateException"></exception>
		Task<IList> ListAsync(ISessionImplementor session, QueryParameters queryParameters, CancellationToken cancellationToken);

		Task<IEnumerable> GetEnumerableAsync(QueryParameters queryParameters, IEventSource session, CancellationToken cancellationToken);

		// Not ported:
		//IScrollableResults scroll(QueryParameters queryParameters, ISessionImplementor session);

		/// <summary>
		/// Perform a bulk update/delete operation given the underlying query definition.
		/// </summary>
		/// <param name="queryParameters">The query bind parameters.</param>
		/// <param name="session">The session owning this query.</param>
		/// <param name="cancellationToken">A cancellation token that can be used to cancel the work</param>
		/// <returns>The number of entities updated or deleted.</returns>
		/// <exception cref="NHibernate.HibernateException"></exception>
		Task<int> ExecuteUpdateAsync(QueryParameters queryParameters, ISessionImplementor session, CancellationToken cancellationToken);
	}
}