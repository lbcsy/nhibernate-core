﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by AsyncGenerator.
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------


using System;
using System.Collections;
using NHibernate.DomainModel;
using NUnit.Framework;

namespace NHibernate.Test
{
	using System.Threading.Tasks;
	/// <summary>
	/// Summary description for SessionCacheTest.
	/// </summary>
	[TestFixture]
	public class SessionCacheTestAsync : TestCase
	{
		protected override string[] Mappings
		{
			get { return new string[] {"Simple.hbm.xml"}; }
		}

		[Test]
		public async Task MakeCollectionTransientAsync()
		{
			ISession fixture = OpenSession();

			for (long i = 1L; i < 6L; i++)
			{
				Simple s = new Simple((int) i);
				s.Address = "dummy collection address " + i;
				s.Date = DateTime.Now;
				s.Name = "dummy collection name " + i;
				s.Pay = i * 1279L;
				await (fixture.SaveAsync(s, i));
			}

			await (fixture.FlushAsync());

			IList list = await (fixture.CreateCriteria(typeof(Simple)).ListAsync());

			Assert.IsNotNull(list);
			Assert.IsTrue(list.Count == 5);
			Assert.IsTrue(fixture.Contains(list[2]));

			fixture.Clear();

			Assert.IsTrue(list.Count == 5);
			Assert.IsFalse(fixture.Contains(list[2]));

			await (fixture.FlushAsync());

			Assert.IsTrue(list.Count == 5);

			await (fixture.DeleteAsync("from System.Object o"));
			await (fixture.FlushAsync());
			fixture.Close();
		}

		[Test]
		public async Task LoadAfterNotExistsAsync()
		{
			ISession fixture = OpenSession();

			// First, prime the fixture session to think the entity does not exist
			try
			{
				await (fixture.LoadAsync(typeof(Simple), -1L));
			}
			catch (ObjectNotFoundException)
			{
				// this is expected
			}

			// Next, lets create that entity under the covers
			ISession anotherSession = null;
			try
			{
				anotherSession = OpenSession();

				Simple oneSimple = new Simple(1);
				oneSimple.Name = "hidden entity";
				oneSimple.Address = "SessionCacheTest.LoadAfterNotExists";
				oneSimple.Date = DateTime.Now;
				oneSimple.Pay = 1000000f;

				await (anotherSession.SaveAsync(oneSimple, -1L));
				await (anotherSession.FlushAsync());
			}
			finally
			{
				QuietlyClose(anotherSession);
			}

			// Verify that the original session is still unable to see the new entry...
			try
			{
				await (fixture.LoadAsync(typeof(Simple), -1L));
			}
			catch (ObjectNotFoundException)
			{
			}

			// Now, lets clear the original session at which point it should be able to see the new entity
			fixture.Clear();

			string failedMessage = "Unable to load entity with id = -1.";
			try
			{
				Simple dummy = await (fixture.LoadAsync(typeof(Simple), -1L)) as Simple;
				Assert.IsNotNull(dummy, failedMessage);
				await (fixture.DeleteAsync(dummy));
				await (fixture.FlushAsync());
			}
			catch (ObjectNotFoundException)
			{
				Assert.Fail(failedMessage);
			}
			finally
			{
				QuietlyClose(fixture);
			}
		}

		private void QuietlyClose(ISession session)
		{
			if (session != null)
			{
				try
				{
					session.Close();
				}
				catch
				{
				}
			}
		}
	}
}